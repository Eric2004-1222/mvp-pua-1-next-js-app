import { anonymousCases, type AnonymousCase, type CaseCategory, type RiskLevel } from "@/lib/cases";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type CaseSourceType = "anonymous_submission" | "editor_case";
export type CaseStatus = "draft" | "published" | "archived";

export type CaseRow = {
  id: string;
  slug: string;
  title: string;
  category: CaseCategory;
  source_type: CaseSourceType;
  risk_level: RiskLevel;
  summary: string;
  views: number;
  comments: number;
  featured: boolean;
  status: CaseStatus;
  situation: string;
  behavior_one: string;
  behavior_two: string;
  conflict: string;
  analysis: string;
  scripts: string[];
  discussion: string[];
  source_submission_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ManagedCase = AnonymousCase & {
  id?: string;
  sourceType: CaseSourceType;
  status: CaseStatus;
  sourceSubmissionId?: string | null;
  updatedAt?: string;
};

export type CaseSubmissionRow = {
  id: string;
  relationship_status: string;
  category: string;
  background: string;
  grievance: string;
  partner_behavior: string;
  desired_outcome: string;
  allow_anonymous_display: boolean;
  status: "pending" | "reviewed" | "published" | "archived";
  created_at: string;
};

function mapCaseRow(row: CaseRow): ManagedCase {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    sourceType: row.source_type,
    riskLevel: row.risk_level,
    summary: row.summary,
    views: row.views,
    comments: row.comments,
    featured: row.featured,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    situation: row.situation,
    behaviors: {
      one: row.behavior_one,
      two: row.behavior_two,
    },
    conflict: row.conflict,
    analysis: row.analysis,
    scripts: row.scripts ?? [],
    discussion: row.discussion ?? [],
    sourceSubmissionId: row.source_submission_id,
  };
}

function fallbackCases(): ManagedCase[] {
  return anonymousCases.map((item) => ({
    ...item,
    sourceType: "editor_case",
    status: "published",
  }));
}

export async function getPublishedCases(category?: string) {
  const supabase = await createClient();
  let query = supabase.from("cases").select("*").eq("status", "published").order("created_at", { ascending: false });

  if (category && category !== "全部") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    const cases = fallbackCases();
    return category && category !== "全部" ? cases.filter((item) => item.category === category) : cases;
  }

  return (data as CaseRow[]).map(mapCaseRow);
}

export async function getFeaturedCases() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data?.length) {
    return fallbackCases().filter((item) => item.featured).slice(0, 3);
  }

  return (data as CaseRow[]).map(mapCaseRow);
}

export async function getPublishedCaseBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("cases").select("*").eq("slug", slug).eq("status", "published").maybeSingle();

  if (!error && data) {
    return mapCaseRow(data as CaseRow);
  }

  const fallback = fallbackCases().find((item) => item.slug === slug);
  return fallback ?? null;
}

export async function getAdminCases() {
  const supabase = createAdminClient();
  if (!supabase) return { cases: [] as ManagedCase[], error: "admin_not_configured" };

  const { data, error } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
  return { cases: ((data ?? []) as CaseRow[]).map(mapCaseRow), error: error?.message ?? null };
}

export async function getAdminCaseById(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { caseItem: null, error: "admin_not_configured" };

  const { data, error } = await supabase.from("cases").select("*").eq("id", id).maybeSingle();
  return { caseItem: data ? mapCaseRow(data as CaseRow) : null, error: error?.message ?? null };
}

export async function getAdminSubmissions() {
  const supabase = createAdminClient();
  if (!supabase) return { submissions: [] as CaseSubmissionRow[], error: "admin_not_configured" };

  const { data, error } = await supabase.from("case_submissions").select("*").order("created_at", { ascending: false });
  return { submissions: (data ?? []) as CaseSubmissionRow[], error: error?.message ?? null };
}

export async function getAdminSubmissionById(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { submission: null, error: "admin_not_configured" };

  const { data, error } = await supabase.from("case_submissions").select("*").eq("id", id).maybeSingle();
  return { submission: (data as CaseSubmissionRow | null) ?? null, error: error?.message ?? null };
}
