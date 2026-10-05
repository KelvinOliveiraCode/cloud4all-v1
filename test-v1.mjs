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
const combos = [["site","gratis"],["banco","ate50"],["banco","ate100"],["ia","gratis"],["ia","ate100"],["arquivos","ate50"],["app","gratis"],["dados","gratis"],["dados","ate100"],["rede","gratis"],["rede","ate100"],["qualquer","qualquer"],["qualquer","gratis"],["app","qualquer",{prov:"Oracle Cloud"}],["site","qualquer",{prov:"Cloudflare"}],["qualquer","qualquer",{prov:"DigitalOcean"}],["qualquer","qualquer",{maxCx:1}],["ia","ate100",{sort:"simples"}],["ia","ate100",{sort:"preco"}]];
for (const [a,p,o] of combos) {
  const r = filtrar(a,p,o);
  const k = a+"+"+p+(o ? "+"+JSON.stringify(o) : "");
  out[k] = r.candidatos.map(c=>c.id);
}
JSON.stringify({n: CATALOGO.length, out, flags: Object.fromEntries(CATALOGO.map(c=>[c.id, c.gratis])), cx: Object.fromEntries(CATALOGO.map(c=>[c.id, c.complexidade])), provs: [...new Set(CATALOGO.map(c=>c.provedor))]});
`;
const res = vm.runInContext(src + test, ctx);
const { n, out, flags, cx, provs } = JSON.parse(res);
console.log("total=" + n + " provs=" + provs.join(","));
const ids = out["qualquer+qualquer"];
const assert = (c, m) => { if (!c) { console.error("FAIL " + m); process.exitCode = 1; } else console.log("PASS " + m); };
assert(n === 124, "catalogo com 124 servicos (atual=" + n + ")");
assert(new Set(ids).size === ids.length, "sem ids duplicados");
assert(["AWS","Azure","Google Cloud","Google","Firebase","Oracle Cloud","Cloudflare","DigitalOcean"].every(p => provs.includes(p)), "8 marcas presentes");
assert(out["site+gratis"].join() === "azure-swa,gcp-firebase-hosting,cf-pages,do-app-platform,azure-app-service,gcp-app-engine,gcp-cloud-run", "site+gratis com Pages e App Platform");
assert(out["ia+gratis"].join() === "google-colab,google-kaggle,gcp-ai-apis", "ia+gratis inalterado");
assert(out["dados+gratis"].join() === "google-looker-studio,gcp-bigquery,gcp-dataform", "dados+gratis inalterado");
assert(out["rede+gratis"].join() === "aws-shield,cf-cdn,cf-dns,aws-acm,gcp-certman,gcp-scc,oracle-lb", "rede+gratis com Cloudflare e Oracle");
assert(out["banco+ate100"].join() === "gcp-firestore,cf-d1,aws-dynamodb,azure-cosmosdb,azure-sql,oracle-autonomous,gcp-cloud-sql,azure-mysql,aws-rds,do-db,oracle-mysql,aws-aurora", "banco+ate100 com D1, Autonomous, DO e Oracle");
assert(out["ia+ate100"].length === 12 && out["ia+ate100"].includes("aws-ec2-gpu"), "ia+ate100 traz as 12 com GPU barata no começo");
assert(out["rede+ate100"].includes("aws-alb") && !out["rede+ate100"].includes("azure-frontdoor"), "rede+ate100 tem ALB e corta Front Door");
assert(out["qualquer+qualquer"].length === 124, "qualquer+qualquer traz tudo");
assert(out["qualquer+gratis"].every(id => flags[id] === "sempre"), "qualquer+gratis so sempre-gratis");
assert(out['app+qualquer+{"prov":"Oracle Cloud"}'].join() === "oracle-functions,oracle-arm,oracle-amd", "filtro Oracle Cloud funciona");
assert(out['site+qualquer+{"prov":"Cloudflare"}'].join() === "cf-pages", "filtro Cloudflare funciona");
assert(out['qualquer+qualquer+{"prov":"DigitalOcean"}'].length === 7, "filtro DigitalOcean traz as 7");
assert(out['qualquer+qualquer+{"maxCx":1}'].length === 11 && out['qualquer+qualquer+{"maxCx":1}'].every(id => cx[id] === 1), "filtro iniciante funciona");
const simples = out['ia+ate100+{"sort":"simples"}'], porPreco = out['ia+ate100+{"sort":"preco"}'];
assert(simples[0] === "google-colab" && porPreco[0] === "google-colab", "ordenacoes comecam no Colab");
assert(simples[5] === "azure-openai" && porPreco[5] === "aws-sagemaker", "ordem simples difere da ordem preco");
console.log(process.exitCode ? "FALHAS" : "TODOS OS TESTES PASSARAM");
