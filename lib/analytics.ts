export const analyticsEvents = {
  casesPageView: "cases_page_view",
  caseCategoryClick: "case_category_click",
  caseDetailView: "case_detail_view",
  caseScriptCopy: "case_script_copy",
  caseSubmitCtaClick: "case_submit_cta_click",
  caseSubmissionSuccess: "case_submission_success",
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];
export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;
