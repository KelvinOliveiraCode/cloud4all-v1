import fs from "node:fs";
const html = fs.readFileSync("C:\\Users\\Kelvin\\Desktop\\cloud4all-v1\\index.html", "utf8");
const src = html.split("<script>")[1].split("</script>")[0];

const elStub = () => ({ innerHTML: "", textContent: "", classList: { toggle(){} }, addEventListener(){}, appendChild(){}, value: "" });
const documentStub = {
  getElementById: () => elStub(),
  querySelectorAll: () => [],
};
const sandbox = { document: documentStub, console };
import vm from "node:vm";
const ctx = vm.createContext(sandbox);
const test = `
;const out = {};
for (const [a,p] of [["site","gratis"],["banco","ate50"],["banco","por-uso"],["ia","gratis"],["ia","ate50"],["arquivos","ate50"],["app","gratis"],["dados","gratis"],["dados","ate50"],["dados","por-uso"],["rede","gratis"],["rede","por-uso"],["qualquer","qualquer"],["qualquer","gratis"]]) {
  const r = filtrar(a,p);
  out[a+"+"+p] = r.candidatos.map(c=>c.id);
}
JSON.stringify({n: CATALOGO.length, out, flags: Object.fromEntries(CATALOGO.map(c=>[c.id, c.gratis])), provs: [...new Set(CATALOGO.map(c=>c.provedor))]});
`;
const res = vm.runInContext(src + test, ctx);
const { n, out, flags, provs } = JSON.parse(res);
console.log("total=" + n + " provs=" + provs.join(","));
const ids = out["qualquer+qualquer"];
const assert = (c, m) => { if (!c) { console.error("FAIL " + m); process.exitCode = 1; } else console.log("PASS " + m); };
assert(n === 101, "catalogo com 101 servicos (atual=" + n + ")");
assert(new Set(ids).size === ids.length, "sem ids duplicados");
assert(["AWS","Azure","Google Cloud","Google","Firebase"].every(p => provs.includes(p)), "5 marcas presentes");
assert(out["site+gratis"].join() === "azure-swa,gcp-firebase-hosting,azure-app-service,gcp-app-engine,gcp-cloud-run", "site+gratis inalterado");
assert(out["ia+gratis"].join() === "google-colab,google-kaggle,gcp-ai-apis", "ia+gratis tem Colab, Kaggle e Speech/Vision");
assert(out["dados+gratis"].join() === "google-looker-studio,gcp-bigquery,gcp-dataform", "dados+gratis tem Looker Studio, BigQuery e Dataform");
assert(out["rede+gratis"].join() === "aws-shield,aws-acm,gcp-certman,gcp-scc", "rede+gratis tem Shield, ACM, Cert Manager e SCC");
assert(out["app+gratis"].includes("fb-auth") && out["app+gratis"].includes("fb-fcm") && out["app+gratis"].includes("gcp-apigw"), "app+gratis tem Auth, FCM e API Gateway");
assert(out["banco+por-uso"].includes("gcp-alloydb") && out["banco+por-uso"].includes("gcp-bigtable"), "banco+por-uso tem AlloyDB e Bigtable");
assert(out["dados+por-uso"].includes("azure-sentinel") && out["dados+por-uso"].includes("azure-adx"), "dados+por-uso tem Sentinel e Data Explorer");
assert(out["qualquer+qualquer"].length === 101, "qualquer+qualquer traz tudo");
assert(out["qualquer+gratis"].every(id => flags[id] === "sempre"), "qualquer+gratis so sempre-gratis");
console.log(process.exitCode ? "FALHAS" : "TODOS OS TESTES PASSARAM");
