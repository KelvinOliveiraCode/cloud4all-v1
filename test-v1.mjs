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
for (const [a,p] of [["site","gratis"],["site","ate50"],["banco","gratis"],["banco","ate50"],["ia","gratis"],["ia","por-uso"],["arquivos","gratis"],["arquivos","ate50"],["app","gratis"],["app","ate50"],["qualquer","qualquer"],["qualquer","gratis"]]) {
  const r = filtrar(a,p);
  out[a+"+"+p] = r.candidatos.map(c=>c.id);
}
JSON.stringify({n: CATALOGO.length, out, flags: Object.fromEntries(CATALOGO.map(c=>[c.id, c.gratis]))});
`;
const res = vm.runInContext(src + test, ctx);
const { n, out, flags } = JSON.parse(res);
console.log("total=" + n);
const assert = (c, m) => { if (!c) { console.error("FAIL " + m); process.exitCode = 1; } else console.log("PASS " + m); };
assert(n === 25, "catalogo com 25 servicos (atual=" + n + ")");
assert(out["site+gratis"].join() === "azure-swa,gcp-firebase-hosting,azure-app-service,gcp-app-engine,gcp-cloud-run", "site+gratis ordenado por simplicidade");
assert(out["banco+ate50"].length === 5 && !out["banco+ate50"].includes("aws-rds"), "banco+ate50 exclui RDS");
assert(out["ia+gratis"].length === 0, "ia+gratis vazio honesto");
assert(out["arquivos+gratis"].join() === "gcp-cloud-storage", "arquivos+gratis so Cloud Storage");
assert(out["arquivos+ate50"].length === 3, "arquivos+ate50 traz S3, Blob e Cloud Storage");
assert(out["app+gratis"].join() === "azure-app-service,gcp-app-engine,gcp-cloud-run,aws-lambda,azure-functions", "app+gratis ordenado");
assert(out["app+ate50"].length === 7 && out["app+ate50"].includes("aws-ec2"), "app+ate50 inclui EC2");
assert(out["qualquer+qualquer"].length === 25, "qualquer+qualquer traz tudo");
assert(out["qualquer+gratis"].every(id => flags[id] === "sempre"), "qualquer+gratis so sempre-gratis");
console.log(process.exitCode ? "FALHAS" : "TODOS OS TESTES PASSARAM");
