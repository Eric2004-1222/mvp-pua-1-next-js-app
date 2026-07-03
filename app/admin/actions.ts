"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, requireAdmin, setAdminSession, verifyAdminPassword } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getLines(formData: FormData, key: string) {
  return getString(formData, key)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function casePayload(formData: FormData) {
  const title = getString(formData, "title");

  return {
    slug: getString(formData, "slug") || makeSlug(title),
    title,
    category: getString(formData, "category"),
    source_type: getString(formData, "source_type"),
    risk_level: getString(formData, "risk_level"),
    summary: getString(formData, "summary"),
    views: Number(getString(formData, "views") || 0),
    comments: Number(getString(formData, "comments") || 0),
    featured: formData.get("featured") === "on",
    status: getString(formData, "status") || "draft",
    situation: getString(formData, "situation"),
    behavior_one: getString(formData, "behavior_one"),
    behavior_two: getString(formData, "behavior_two"),
    conflict: getString(formData, "conflict"),
    analysis: getString(formData, "analysis"),
    scripts: getLines(formData, "scripts"),
    discussion: getLines(formData, "discussion"),
    source_submission_id: getString(formData, "source_submission_id") || null,
    updated_at: new Date().toISOString(),
  };
}

function adminClientOrRedirect() {
  const supabase = createAdminClient();
  if (!supabase) {
    redirect("/admin/cases?message=" + encodeURIComponent("请先配置 SUPABASE_SERVICE_ROLE_KEY 和 ADMIN_PASSWORD。"));
  }

  return supabase;
}

export async function adminSignIn(formData: FormData) {
  const password = getString(formData, "password");

  if (!verifyAdminPassword(password)) {
    redirect("/admin/login?message=" + encodeURIComponent("管理员密码不正确，或 ADMIN_PASSWORD 还没有配置。"));
  }

  await setAdminSession();
  redirect("/admin/cases");
}

export async function adminSignOut() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createCase(formData: FormData) {
  await requireAdmin();
  const supabase = adminClientOrRedirect();
  const payload = casePayload(formData);

  const { error } = await supabase.from("cases").insert(payload);

  if (error) {
    redirect("/admin/cases/new?message=" + encodeURIComponent(error.message));
  }

  revalidatePath("/cases");
  redirect("/admin/cases");
}

export async function updateCase(caseId: string, formData: FormData) {
  await requireAdmin();
  const supabase = adminClientOrRedirect();
  const payload = casePayload(formData);

  const { error } = await supabase.from("cases").update(payload).eq("id", caseId);

  if (error) {
    redirect(`/admin/cases/${caseId}/edit?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/cases");
  revalidatePath(`/cases/${payload.slug}`);
  redirect("/admin/cases");
}

export async function setCaseStatus(caseId: string, status: "draft" | "published" | "archived") {
  await requireAdmin();
  const supabase = adminClientOrRedirect();
  await supabase.from("cases").update({ status, updated_at: new Date().toISOString() }).eq("id", caseId);
  revalidatePath("/cases");
  redirect("/admin/cases");
}

export async function setCaseFeatured(caseId: string, featured: boolean) {
  await requireAdmin();
  const supabase = adminClientOrRedirect();
  await supabase.from("cases").update({ featured, updated_at: new Date().toISOString() }).eq("id", caseId);
  revalidatePath("/cases");
  redirect("/admin/cases");
}

export async function createCaseFromSubmission(formData: FormData) {
  await requireAdmin();
  const supabase = adminClientOrRedirect();
  const submissionId = getString(formData, "source_submission_id");
  const payload = casePayload(formData);

  const { error } = await supabase.from("cases").insert(payload);

  if (error) {
    redirect(`/admin/submissions/${submissionId}?message=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("case_submissions").update({ status: "published" }).eq("id", submissionId);
  revalidatePath("/cases");
  redirect("/admin/cases");
}
