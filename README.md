# [Vue 3 + Vuetify + Pinia] AI Metrics Dashboard

Projeto base consolidado para painel de acurácia da IA com:

- Vue 3
- Vuetify
- Pinia
- Vue Router
- ApexCharts
- Vitest
- Integração com backend FastAPI real

## Estrutura

```text
src/
├── app/
├── components/
├── modules/
│   └── ai-metrics/
├── views/
└── styles/
```

## Rodar localmente com backend real

### 1. Backend FastAPI

No projeto `ai-metrics-backend`:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8201
```

### 2. Frontend Vue

No projeto `ai-metrics-vue-vuetify`:

```bash
cp .env.example .env
npm install
npm run dev
```

Aplicação padrão:

- Início: `http://localhost:5193/`
- Dashboard: `http://localhost:5193/ai-metrics`

Com a configuração padrão do `.env.example`, o frontend usa o proxy do Vite e consome:

- `GET /v1/dashboard/ia?janela_dias=30`
- `POST /v1/recomendacoes`
- `POST /v1/recomendacoes/{id}/decisao`
- `POST /v1/recomendacoes/{id}/outcome`

## Rodar apenas com mock local

Altere no `.env`:

```env
VITE_AI_METRICS_USE_MOCK=true
```

## Rodar testes

```bash
npm run test
```

## Onde está a integração

Arquivo principal:

```text
src/modules/ai-metrics/api/aiMetricsService.js
```

Funções disponíveis:

- `buscarMetricasIA(janelaDias)`
- `criarRecomendacao(payload)`
- `registrarDecisaoRecomendacao(idRecomendacao, payload)`
- `registrarOutcomeRecomendacao(idRecomendacao, payload)`
- `obterConfiguracaoAiMetrics()`

## Exemplos de payload

### Criar recomendação

```json
{
  "id_incidente": 991,
  "tipo_recomendacao": "hotfix",
  "confianca_ia": 0.91,
  "recomendacao": "Aplicar validação de CPF no frontend e backend",
  "modelo": "gemini-2.5-flash",
  "score_inicial": 0.84,
  "titulo": "Cadastro / Salvar: CPF inválido"
}
```

### Registrar decisão

```json
{
  "aceita": true,
  "motivo_decisao": "Falha recorrente em produção",
  "decidido_por": "ericsonjosedossantos@tieri659.onmicrosoft.com"
}
```

### Registrar outcome

```json
{
  "foi_aplicada": true,
  "versao_aplicada": "2.4.1",
  "outcome_positivo": true,
  "score_pos_correcao": 0.84,
  "observacao": "Queda do erro após deploy"
}
```

## Observações

- Em desenvolvimento, o proxy do Vite evita problema de CORS.
- Em homologação ou produção, defina `VITE_AI_METRICS_API_BASE_URL` com a URL do backend.
- O backend deve permitir a origem do frontend na variável `cors_origins`.

## Integração com incidentes

A tela `/ai-metrics/operacoes` agora consulta incidentes reais do backend, permite seleção e preenche automaticamente `id_incidente`, `titulo`, `contexto_incidente` e `score_inicial`.
