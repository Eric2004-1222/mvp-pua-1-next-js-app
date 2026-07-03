"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthErrorMessage, getSupabaseConfig, supabaseSetupMessage } from "@/lib/supabase/config";
import { randomInviteCode, splitTags } from "@/lib/format";
import type { CommentKind } from "@/lib/types";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { supabase, user };
}

export async function signUp(formData: FormData) {
  if (!getSupabaseConfig().isConfigured) {
    redirect(`/login?message=${encodeURIComponent(supabaseSetupMessage)}`);
  }

  const supabase = await createClient();
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const nickname = getString(formData, "nickname") || "温柔的新朋友";

  let errorMessage = "";

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });

    if (error) errorMessage = getAuthErrorMessage(error);
  } catch (error) {
    errorMessage = getAuthErrorMessage(error);
  }

  if (errorMessage) redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
  redirect("/posts");
}

export async function signIn(formData: FormData) {
  if (!getSupabaseConfig().isConfigured) {
    redirect(`/login?message=${encodeURIComponent(supabaseSetupMessage)}`);
  }

  const supabase = await createClient();
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  let errorMessage = "";

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) errorMessage = getAuthErrorMessage(error);
  } catch (error) {
    errorMessage = getAuthErrorMessage(error);
  }

  if (errorMessage) redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
  redirect("/posts");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createPost(formData: FormData) {
  const { supabase, user } = await requireUser();
  const title = getString(formData, "title");
  const content = getString(formData, "content");
  const tags = splitTags(formData.get("tags"));
  const isAnonymous = formData.get("is_anonymous") === "on";

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    title,
    content,
    tags,
    is_anonymous: isAnonymous,
  });

  if (error) redirect(`/create?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/posts");
  redirect("/posts");
}

export async function createComment(postId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const content = getString(formData, "content");
  const kind = getString(formData, "kind") as CommentKind;
  const isAnonymous = formData.get("is_anonymous") === "on";

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content,
    kind,
    is_anonymous: isAnonymous,
  });

  if (error) redirect(`/posts/${postId}?message=${encodeURIComponent(error.message)}`);
  revalidatePath(`/posts/${postId}`);
}

export async function createInvite() {
  const { supabase, user } = await requireUser();
  const code = randomInviteCode();

  const { error } = await supabase.from("couples").insert({
    created_by: user.id,
    partner_id: null,
    invite_code: code,
  });

  if (error) redirect(`/couple/bind?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/couple/bind");
}

export async function bindInvite(formData: FormData) {
  const { supabase, user } = await requireUser();
  const code = getString(formData, "invite_code").toUpperCase();

  const { data: couple, error: findError } = await supabase
    .from("couples")
    .select("*")
    .eq("invite_code", code)
    .is("partner_id", null)
    .neq("created_by", user.id)
    .maybeSingle();

  if (findError || !couple) {
    redirect("/couple/bind?message=" + encodeURIComponent("邀请码无效，或已经被绑定。"));
  }

  const { error } = await supabase
    .from("couples")
    .update({ partner_id: user.id, bound_at: new Date().toISOString() })
    .eq("id", couple.id);

  if (error) redirect(`/couple/bind?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/couple");
  redirect("/couple");
}

export async function createDiary(formData: FormData) {
  const { supabase, user } = await requireUser();
  const coupleId = getString(formData, "couple_id");
  const content = getString(formData, "content");
  const mood = getString(formData, "mood") || null;

  const { error } = await supabase.from("couple_diaries").insert({
    couple_id: coupleId,
    author_id: user.id,
    content,
    mood,
  });

  if (error) redirect(`/couple?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/couple");
}

export async function submitCase(formData: FormData) {
  if (!getSupabaseConfig().isConfigured) {
    redirect(`/submit-case?message=${encodeURIComponent(supabaseSetupMessage)}`);
  }

  const supabase = await createClient();
  const relationshipStatus = getString(formData, "relationship_status");
  const category = getString(formData, "category");
  const background = getString(formData, "background");
  const grievance = getString(formData, "grievance");
  const partnerBehavior = getString(formData, "partner_behavior");
  const desiredOutcome = getString(formData, "desired_outcome");
  const allowAnonymousDisplay = getString(formData, "allow_anonymous_display") === "允许";

  const { error } = await supabase.from("case_submissions").insert({
    relationship_status: relationshipStatus,
    category,
    background,
    grievance,
    partner_behavior: partnerBehavior,
    desired_outcome: desiredOutcome,
    allow_anonymous_display: allowAnonymousDisplay,
  });

  if (error) {
    redirect(`/submit-case?message=${encodeURIComponent(`投稿暂时没有保存成功：${error.message}`)}`);
  }

  redirect(
    `/submit-case?success=${encodeURIComponent("已收到。表达清楚、细节完整的问题会优先被整理成匿名案例。")}`,
  );
}
