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
for (const [a,p] of [["site","gratis"],["site","ate50"],["site","ate100"],["site","por-uso"],["banco","gratis"],["banco","ate50"],["banco","por-uso"],["ia","gratis"],["ia","ate50"],["ia","ate100"],["ia","por-uso"]]) {
  const r = filtrar(a,p);
  out[a+"+"+p] = r.candidatos.map(c=>c.id);
}
JSON.stringify(out);
`;
const res = vm.runInContext(src + test, ctx);
console.log(res);
const o = JSON.parse(res);
const assert = (c, m) => { if (!c) { console.error("FAIL " + m); process.exitCode = 1; } else console.log("PASS " + m); };
assert(o["site+gratis"].join() === "azure-swa,gcp-firebase-hosting,azure-app-service,gcp-cloud-run", "site+gratis ordenado por simplicidade");
assert(o["banco+ate50"].length === 5 && !o["banco+ate50"].includes("aws-rds"), "banco+ate50 exclui RDS");
assert(o["ia+gratis"].length === 0, "ia+gratis vazio honesto");
assert(o["ia+por-uso"].length === 6, "ia+por-uso traz os 6");
assert(o["site+ate100"].length === 6, "site+ate100 traz os 6");
assert(o["banco+gratis"].every(id => ["gcp-firestore","aws-dynamodb","azure-cosmosdb","azure-sql"].includes(id)), "banco+gratis so sempre-gratis");
console.log(process.exitCode ? "FALHAS" : "TODOS OS TESTES PASSARAM");
