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
no Node, com 12 asserções (ordenação, exclusão por teto, vazios honestos,
cobertura total, sem duplicatas):

```powershell
node test-v1.mjs
```

## O que a v1 contém (v1.4: catálogo completo, 75 serviços)

- Abertura enxuta: título + 1 linha. Sem kicker institucional, sem fórmula
  interna exposta (o passo a passo continua em "Como chegamos aqui").
- Trilho em 2 passos com **"Qualquer um"** (negócio) e **"Qualquer preço"**
  **pré-selecionados**: o site abre já com recomendação na tela.
  Áreas: site · app/API · banco de dados · arquivos · analisar dados ·
  rede e entrega · treino de IA.
- Catálogo com **75 serviços** (AWS 27 · Azure 25 · Google Cloud 22 · Google 1),
  cobrindo compute, containers, serverless, filas, armazenamento, bancos,
  rede/CDN/DNS, analytics e IA/ML de cada provedor. Curadoria via enxame de
  subagents (nomes/URLs) + conferência manual dos níveis gratuitos; amostra de
  5 links oficiais verificada com retorno 2xx.
- Snapshot de preços: **out/2026**, valores aproximados em R$ para uso pequeno
  (conversão aproximada de USD 1 ≈ R$ 5,50). Cada linha liga a página oficial
  de preços/docs — confirme sempre lá.
- Caso sem opção honesta (ex.: `rede + gratuito`): a página **diz que não há**
  em vez de forçar indicação.
- Layout em **tela cheia** e navegação por **abas**: Início · Catálogo ·
  Como funciona · O projeto. Hash acompanha (`#catalogo`, `#como-funciona`).
- Logo em SVG próprio: só a nuvenzinha, de olhos fechados e sorriso
  (três curvas, sem dentes). Monocromático.
- Barras de rolagem finas (10px página, 8px trilho).

## Design

Paleta monocromática (tinta `#101013` sobre papel `#f5f5f3`, cinzas para
profundidade; pretos/brancos puros evitados por contraste e acabamento),
tipos finas **Archivo 200–600** + números em **IBM Plex Mono**, sem gradiente,
sem vidro, sem emoji como ícone, sem métrica inventada.

## Roteiro

- `v1` — esta página (filtro determinístico).
- `v2` — plugar IA por último: o chat passa a extrair área/preço da frase e
  chamar o mesmo `filtrar`; preços continuam vindo do catálogo, nunca do modelo.
- `v3` — configuração assistida do serviço escolhido.

## Nota de integridade (05/out/2026)

A pasta anterior `Desktop\cloud4all` (Next.js + FastAPI + catálogo de 55 itens)
existia no início da sessão e **desapareceu do disco no meio do trabalho**
(confirmado por leitura de diretório e `Test-Path`). Esta v1 foi reconstruída
do zero em `Desktop\cloud4all-v1` e não depende daqueles arquivos.

Site público: <https://kelvinoliveiracode.github.io/cloud4all-v1/>
