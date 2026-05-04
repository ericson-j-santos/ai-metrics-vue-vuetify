# Bundle Summary

## Atualização aplicada

- integração com incidentes reais no fluxo operacional
- seleção de incidente com preenchimento automático de `id_incidente`, `titulo` e `contexto_incidente`
- consumo de `GET /v1/incidentes` e `GET /v1/incidentes/{id}`
- detalhe do incidente exibido antes da criação da recomendação
- recomendação persiste `contexto_incidente`

## Fluxo operacional

1. Selecionar incidente
2. Revisar contexto e score
3. Criar recomendação
4. Registrar decisão
5. Registrar outcome
6. Consultar dashboard consolidado
