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
for (const [a,p] of [["site","gratis"],["banco","ate50"],["ia","gratis"],["ia","ate50"],["arquivos","ate50"],["app","gratis"],["dados","gratis"],["dados","ate50"],["rede","gratis"],["rede","por-uso"],["qualquer","qualquer"],["qualquer","gratis"]]) {
  const r = filtrar(a,p);
  out[a+"+"+p] = r.candidatos.map(c=>c.id);
}
JSON.stringify({n: CATALOGO.length, out, flags: Object.fromEntries(CATALOGO.map(c=>[c.id, c.gratis])), provs: [...new Set(CATALOGO.map(c=>c.provedor))]});
`;
const res = vm.runInContext(src + test, ctx);
const { n, out, flags, provs } = JSON.parse(res);
console.log("total=" + n + " provs=" + provs.join(","));
const ids = JSON.parse(res).out["qualquer+qualquer"];
const assert = (c, m) => { if (!c) { console.error("FAIL " + m); process.exitCode = 1; } else console.log("PASS " + m); };
assert(n === 75, "catalogo com 75 servicos (atual=" + n + ")");
assert(new Set(ids).size === ids.length, "sem ids duplicados");
assert(["AWS","Azure","Google Cloud","Google"].every(p => provs.includes(p)), "4 marcas presentes");
assert(out["site+gratis"].join() === "azure-swa,gcp-firebase-hosting,azure-app-service,gcp-app-engine,gcp-cloud-run", "site+gratis inalterado");
assert(out["ia+gratis"].join() === "google-colab,gcp-ai-apis", "ia+gratis agora tem Colab + Speech/Vision");
assert(out["dados+gratis"].join() === "gcp-bigquery", "dados+gratis so BigQuery");
assert(out["dados+ate50"].includes("aws-athena") && out["dados+ate50"].includes("azure-datafactory"), "dados+ate50 tem Athena e Data Factory");
assert(out["rede+gratis"].length === 0, "rede+gratis vazio honesto");
assert(out["rede+por-uso"].includes("aws-alb") && out["rede+por-uso"].includes("azure-frontdoor"), "rede+por-uso tem ALB e Front Door");
assert(out["app+gratis"].includes("aws-lambda") && out["app+gratis"].includes("gcp-pubsub") && out["app+gratis"].includes("gcp-compute"), "app+gratis tem Lambda, Pub/Sub e Compute Engine");
assert(out["qualquer+qualquer"].length === 75, "qualquer+qualquer traz tudo");
assert(out["qualquer+gratis"].every(id => flags[id] === "sempre"), "qualquer+gratis so sempre-gratis");
console.log(process.exitCode ? "FALHAS" : "TODOS OS TESTES PASSARAM");
