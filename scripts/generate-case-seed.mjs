import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync("lib/cases.ts", "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const moduleShim = { exports: {} };
Function("module", "exports", output)(moduleShim, moduleShim.exports);

const cases = moduleShim.exports.anonymousCases;

function escapeSql(value) {
  return String(value ?? "").replace(/'/g, "''");
}

function textArray(values) {
  return `array[${(values ?? []).map((value) => `'${escapeSql(value)}'`).join(",")}]::text[]`;
}

const rows = cases
  .map((item) => {
    const values = [
      item.slug,
      item.title,
      item.category,
      "editor_case",
      item.riskLevel,
      item.summary,
      Number(item.views) || 0,
      Number(item.comments) || 0,
      item.featured ? "true" : "false",
      "published",
      item.situation,
      item.behaviors.one,
      item.behaviors.two,
      item.conflict,
      item.analysis,
    ];

    return `('${escapeSql(values[0])}','${escapeSql(values[1])}','${escapeSql(values[2])}','${escapeSql(values[3])}','${escapeSql(values[4])}','${escapeSql(values[5])}',${values[6]},${values[7]},${values[8]},'${values[9]}','${escapeSql(values[10])}','${escapeSql(values[11])}','${escapeSql(values[12])}','${escapeSql(values[13])}','${escapeSql(values[14])}',${textArray(item.scripts)},${textArray(item.discussion)})`;
  })
  .join(",\n");

console.log(`insert into public.cases (
  slug,
  title,
  category,
  source_type,
  risk_level,
  summary,
  views,
  comments,
  featured,
  status,
  situation,
  behavior_one,
  behavior_two,
  conflict,
  analysis,
  scripts,
  discussion
) values
${rows}
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  source_type = excluded.source_type,
  risk_level = excluded.risk_level,
  summary = excluded.summary,
  views = excluded.views,
  comments = excluded.comments,
  featured = excluded.featured,
  status = excluded.status,
  situation = excluded.situation,
  behavior_one = excluded.behavior_one,
  behavior_two = excluded.behavior_two,
  conflict = excluded.conflict,
  analysis = excluded.analysis,
  scripts = excluded.scripts,
  discussion = excluded.discussion,
  updated_at = now();`);
