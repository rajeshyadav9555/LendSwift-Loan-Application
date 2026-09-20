# Integration Bridge: SAP S/4HANA to FinSight

Design package for the Meridian Manufacturing simulation. The integration remains a design-first project: SAP and FinSight are represented by contracts and controlled test fixtures, not live services.

## Scope

- Extract financial and operational data from SAP S/4HANA using CDS/ODP delta interfaces.
- Transform and validate records in an India-region processing boundary.
- Load idempotently into Zetheta FinSight.
- Reconcile source and target counts, checksums, and business keys.
- Operate with bounded retries, circuit breakers, a DLQ, audit lineage, and alerts.

## Repository map

- `api/openapi.yaml`: OpenAPI 3.0 contract for representative source and destination resources.
- `docs/D1_Integration_Architecture_v1.md`: context, containers, constraints, and decisions.
- `docs/D3_Data_Transformation_v1.md`: field-level mappings and quality rules.
- `docs/D4_Error_Handling_v1.md`: error taxonomy, retry policy, and DLQ behavior.
- `docs/D5_Reconciliation_v1.md`: reconciliation dimensions and report contract.
- `docs/D6_Monitoring_v1.md`: dashboard panels, logs, and alert rules.
- `docs/D7_Integration_Testing_v1.md`: functional, non-functional, security, and failure tests.
- `docs/D8_Deployment_Runbook_v1.md`: deployment, verification, and rollback procedure.

## Operating constraints

- Processing and storage stay in AWS Mumbai (`ap-south-1`).
- SAP extraction is capped at 50 RFC connections and one ODP delta per provider every 30 minutes.
- No heavy extraction runs during the 01:00-04:30 IST SAP batch window.
- Business-hour network usage stays below 25% of the shared 450 Mbps link.
- Every record carries `correlation_id`, `batch_id`, source key, mapping version, and lineage metadata.

## Design status

This package is a simulation deliverable. Replace endpoint hosts, SAP authorisation objects, tenant IDs, certificates, and operational contacts during client discovery. No credentials or real financial data belong in this repository.
