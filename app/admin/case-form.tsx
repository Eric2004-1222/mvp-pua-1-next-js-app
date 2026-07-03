import { caseCategories } from "@/lib/cases";
import { inputClass, textareaClass } from "@/components/ui";
import type { ManagedCase } from "@/lib/cases-db";

const riskLevels = ["低风险", "中风险", "高风险"];
const statuses = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "发布" },
  { value: "archived", label: "下架" },
];
const sourceTypes = [
  { value: "editor_case", label: "编辑整理案例" },
  { value: "anonymous_submission", label: "匿名投稿案例" },
];

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-ink/72">{label}</span>
      {children}
    </label>
  );
}

export function CaseForm({
  action,
  submitLabel,
  caseItem,
  sourceSubmissionId,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  caseItem?: Partial<ManagedCase>;
  sourceSubmissionId?: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="source_submission_id" value={sourceSubmissionId ?? caseItem?.sourceSubmissionId ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldBlock label="标题">
          <input className={inputClass} name="title" required defaultValue={caseItem?.title ?? ""} />
        </FieldBlock>
        <FieldBlock label="Slug">
          <input className={inputClass} name="slug" placeholder="留空会自动生成" defaultValue={caseItem?.slug ?? ""} />
        </FieldBlock>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <FieldBlock label="分类">
          <select className={inputClass} name="category" defaultValue={caseItem?.category ?? "冷战"}>
            {caseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FieldBlock>
        <FieldBlock label="风险等级">
          <select className={inputClass} name="risk_level" defaultValue={caseItem?.riskLevel ?? "中风险"}>
            {riskLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </FieldBlock>
        <FieldBlock label="来源类型">
          <select className={inputClass} name="source_type" defaultValue={caseItem?.sourceType ?? "editor_case"}>
            {sourceTypes.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
        </FieldBlock>
        <FieldBlock label="状态">
          <select className={inputClass} name="status" defaultValue={caseItem?.status ?? "draft"}>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </FieldBlock>
      </div>

      <label className="flex items-center gap-3 rounded-2xl bg-blush-50 px-4 py-3 text-sm font-medium text-ink/68">
        <input name="featured" type="checkbox" className="h-4 w-4 accent-blush-500" defaultChecked={caseItem?.featured ?? false} />
        设置为精选案例
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldBlock label="浏览量">
          <input className={inputClass} name="views" type="number" min="0" defaultValue={caseItem?.views ?? 0} />
        </FieldBlock>
        <FieldBlock label="评论数">
          <input className={inputClass} name="comments" type="number" min="0" defaultValue={caseItem?.comments ?? 0} />
        </FieldBlock>
      </div>

      <FieldBlock label="摘要">
        <textarea className={textareaClass} name="summary" required defaultValue={caseItem?.summary ?? ""} />
      </FieldBlock>

      <FieldBlock label="情况描述">
        <textarea className={textareaClass} name="situation" defaultValue={caseItem?.situation ?? ""} />
      </FieldBlock>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldBlock label="一方行为">
          <textarea className={textareaClass} name="behavior_one" defaultValue={caseItem?.behaviors?.one ?? ""} />
        </FieldBlock>
        <FieldBlock label="另一方行为">
          <textarea className={textareaClass} name="behavior_two" defaultValue={caseItem?.behaviors?.two ?? ""} />
        </FieldBlock>
      </div>

      <FieldBlock label="核心矛盾">
        <textarea className={textareaClass} name="conflict" defaultValue={caseItem?.conflict ?? ""} />
      </FieldBlock>

      <FieldBlock label="旁观者分析">
        <textarea className={textareaClass} name="analysis" defaultValue={caseItem?.analysis ?? ""} />
      </FieldBlock>

      <FieldBlock label="建议话术（每行一条）">
        <textarea className={textareaClass} name="scripts" defaultValue={(caseItem?.scripts ?? []).join("\n")} />
      </FieldBlock>

      <FieldBlock label="评论区讨论（每行一条）">
        <textarea className={textareaClass} name="discussion" defaultValue={(caseItem?.discussion ?? []).join("\n")} />
      </FieldBlock>

      <button className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
