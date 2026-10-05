# Cloud4All Brasil — v1 (GH Pages)

Primeira versão navegável do projeto: um **arquivo HTML único** (`index.html`),
sem build, sem IA. A recomendação é 100% determinística: filtro
`área ∩ preço → menor custo → mais simples`, com a conta aberta em
“Como chegamos aqui”.

## Abrir local

Duplo clique em `index.html`, ou:

```powershell
Set-Location 'C:\Users\Kelvin\Desktop\cloud4all-v1'
python -m http.server 8080
# abrir http://localhost:8080
```

## Verificar a regra (teste real, sem IA)

`test-v1.mjs` extrai o `<script>` do `index.html` e roda o `filtrar` de verdade
no Node, com 6 asserções (ordenação, exclusão por teto, vazio honesto em
`ia+gratis`, cobertura total em `por-uso`):

```powershell
node test-v1.mjs
```

## O que a v1 contém (v1.1: abas + tela cheia)

- Layout em **tela cheia** (sem coluna espremida) e navegação por **abas**:
  Início (2 passos + recomendação + conversa) · Catálogo · Como funciona ·
  O projeto. Hash da URL acompanha (`#catalogo`, `#como-funciona`, `#projeto`).
- Logo em SVG próprio: nuvenzinha com um bonequinho azul sorrindo de trás dela.

- Trilho de 2 passos: **área** (hospedar site · banco de dados · treinamento de IA)
  × **preço** (gratuito · até R$ 50 · até R$ 100 · conforme o uso).
- Recomendação com **nuvem ideal + 2 alternativas** e motivo comparativo gerado
  por template (nada redigido por IA).
- **Chat-maquete**: visível, mas responde texto fixo avisando que a busca
  automática entra na v2. Não finge conversar.
- **Catálogo por preço** com os 18 serviços, só dos provedores do resumo do
  projeto (AWS, Azure, Google Cloud). Snapshot de preços: **out/2026**,
  valores aproximados em R$ para uso pequeno — cada linha liga a página
  oficial de preços/docs.
- Caso sem opção honesta (`ia + gratuito`): a página **diz que não há** e
  sugere alternativa fora do escopo, em vez de forçar indicação.

## Design

Paleta monocromática (tinta `#101013` sobre papel `#f5f5f3`, cinzas para
profundidade; pretos/brancos puros evitados por contraste e acabamento),
tipos finas **Archivo 200–600** + números em **IBM Plex Mono**, sem gradiente,
sem vidro, sem emoji como ícone, sem métrica inventada.

## Roteiro

- `v1` — esta página (filtro determinístico).
- `v2` — plugar IA: o chat passa a extrair área/preço da frase e chamar o
  mesmo `filtrar`; preços continuam vindo do catálogo, nunca do modelo.
- `v3` — configuração assistida do serviço escolhido.

## Nota de integridade (05/out/2026)

A pasta anterior `Desktop\cloud4all` (Next.js + FastAPI + catálogo de 55 itens)
existia no início da sessão e **desapareceu do disco no meio do trabalho**
(confirmado por leitura de diretório e `Test-Path`). Esta v1 foi reconstruída
do zero em `Desktop\cloud4all-v1` e não depende daqueles arquivos. Se a pasta
original reaparecer (outro Desktop/OneDrive, lixeira), o catálogo dela pode
realimentar esta página na v1.1.

Site público: <https://kelvinoliveiracode.github.io/cloud4all-v1/>
