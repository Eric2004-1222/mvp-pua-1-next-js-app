import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "x_admin_session";
const ADMIN_COOKIE_VALUE = "ok";

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function isAdminSignedIn() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
}

export async function requireAdmin() {
  if (!(await isAdminSignedIn())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export function verifyAdminPassword(password: string) {
  return Boolean(process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD);
}
