# D6 Monitoring and Alerting

## Dashboard panels

1. Pipeline health by domain: red when stale >4h or failed.
2. Records processed per second by domain.
3. API P95 latency.
4. Error rate by class.
5. DLQ depth and 24-hour trend.
6. Reconciliation status and variance amount.
7. SAP RFC pool utilisation and response time.
8. FinSight response time, remaining rate-limit headroom, token expiry.
9. Data freshness by domain.
10. CPU, memory, disk, and network utilisation.
11. Kafka consumer lag by topic and partition.
12. Circuit-breaker state by dependency.

## Structured log minimum

Every JSON log includes `timestamp`, `level`, `service`, `environment`, `correlation_id`, `batch_id`, `domain`, `source_key`, `mapping_version`, `attempt`, `event`, `duration_ms`, and `error_code` when applicable. Payload values containing financial identifiers are hashed or masked.

## Alerts

- P1: pipeline health red, error rate >5%, Kafka unavailable, DLQ >500, SAP RFC pool >90%.
- P2: circuit open, reconciliation break, FinSight rate-limit headroom <10%, P95 >5s, disk >90%.
- P3: domain freshness outside SLA, stale exchange rate, consumer lag >50k, token expiry <15 minutes.
- P4: throughput below 50% baseline, isolated data-quality quarantine, schema drift warning.

Alerts route P1/P2 to PagerDuty and the integration on-call; P3/P4 go to the operations channel and daily digest. Every alert includes a runbook link, current batch, owner, and suggested first action.
