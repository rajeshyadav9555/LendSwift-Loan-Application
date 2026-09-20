# D5 Reconciliation and Data Quality

A batch is `RECONCILED` only when all required dimensions pass. Exceptions remain visible and are never silently discarded.

## Reconciliation dimensions

| Dimension | Calculation | Pass condition |
| --- | --- | --- |
| Completeness | extracted = loaded + quarantined + idempotent duplicates | Exact equality |
| Accuracy | Source debit/credit and target debit/credit checksums | Variance INR 0.00 after scale-2 rounding |
| Timeliness | load completion - extraction completion | Within four-hour freshness SLA |
| Consistency | References resolved across GL, cost centre, profit centre, vendor | 100% for loaded records |
| Uniqueness | Count of unique business keys | No duplicate target keys |

## Batch report

`batch_id`, source/target timestamps, previous/current delta tokens, records extracted, passed validation, failed validation, transformed, loaded, skipped idempotently, DLQ count, debit checksum, credit checksum, target checksums, variance, duration by stage, throughput, top errors, and reconciliation status.

## Resolution workflow

1. Reconciliation service calculates metrics after the target load receipt.
2. A variance creates an immutable break record and P2 alert.
3. The operator compares source lineage keys with target receipts; no blind replay is allowed.
4. Corrected records are revalidated and replayed with a new attempt number.
5. The batch closes only after checksums and counts pass, or an approved exception is attached by the data steward.
