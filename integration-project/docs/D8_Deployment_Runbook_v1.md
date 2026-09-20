# D8 Deployment Runbook

## Preconditions

1. CAB approval and approved change record exist.
2. Synthetic smoke fixtures and rollback artifact are available.
3. AWS Mumbai network route, certificates, secrets, and Kafka topics are healthy.
4. SAP transport, ODP subscriptions, RFC destination, and authorisations are approved.
5. FinSight scopes and rate limits are confirmed.
6. Backup of connector configuration, delta-token store, and audit indexes is complete.
7. Stakeholders have the maintenance window and rollback decision authority.

## Deployment

1. Pause scheduled extraction and verify no active batch is in a critical stage.
2. Deploy the inactive integration version with feature flag disabled.
3. Apply backward-compatible configuration and schema migrations.
4. Run health checks for SAP, Kafka, FinSight, audit store, and metrics.
5. Run a 100-record synthetic GL smoke batch.
6. Verify counts, checksums, lineage, dashboard panels, and alert delivery.
7. Enable canary processing for one company code (MC01) for 30 minutes.
8. Compare throughput, P95 latency, error rate, and reconciliation with baseline.
9. Expand to MC02 and MC03 only after the canary passes.
10. Resume schedules outside the SAP batch window and monitor for four hours.

## Rollback

Rollback when there is data loss, unreconciled financial variance, repeated P1 alerts, or SAP RFC utilisation above 90% for five minutes. Disable the feature flag, stop new extraction, drain or preserve Kafka offsets, restore the previous connector image/configuration, and replay only from the last committed delta token. The release owner decides within 15 minutes with the CFO delegate and SAP Basis lead informed. Never delete DLQ or audit records during rollback.

## Verification

Confirm target health, token progression, exact count/checksum reconciliation, no unexpected DLQ growth, correct Grafana status, successful alert test, network usage below 25% during business hours, and documented handover to L1/L2/L3 support.
