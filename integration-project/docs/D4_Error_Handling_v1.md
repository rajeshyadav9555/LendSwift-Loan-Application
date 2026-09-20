# D4 Error Handling and Retry Framework

## Classification

| Class | Examples | Default action |
| --- | --- | --- |
| TRANSIENT | RFC timeout, HTTP 429/503, network partition | Retry with policy, then circuit break or DLQ |
| PERMANENT | Invalid token, missing endpoint, unsupported schema | Stop retries, alert owner |
| DATA_QUALITY | Null required field, invalid date/currency, orphan reference | Quarantine record, continue batch |
| BUSINESS | FinSight 409/422, tenant lock | Idempotency comparison or business queue |
| SYSTEM | Kafka outage, disk below 10%, schema incompatibility | Halt affected domain and page operations |

## Retry policy

For attempt $n$, `wait = min(cap, random(base, base * 2^n))`.

- SAP timeout: base 2s, cap 60s, 3 attempts.
- FinSight 429: honor `Retry-After`, then exponential backoff, 5 attempts.
- FinSight 503: 60s linear intervals, 5 attempts.
- FinSight 401 token expiry: refresh once; invalid token afterward is permanent.
- 400/422 validation failures: never retry unchanged payloads.

## Circuit breaker

Closed -> Open after 5 failures in 60 seconds. Open remains for 120 seconds. Half-open permits one probe. Two successful probes close the circuit; any failed probe reopens it. The breaker is independent for SAP, Kafka, and FinSight so AP failure cannot block GL processing.

## DLQ contract

Each DLQ record contains `error_code`, `error_class`, `batch_id`, `correlation_id`, source key, mapping version, redacted payload, first-seen timestamp, retry count, and recommended action. Retention is 30 days. Reprocessing requires an operator approval, a new idempotency key, and a successful validation preview. Secrets and Aadhaar/PAN values are never written to the DLQ.

## Core registry

- `ERR-EXT-001`: SAP RFC timeout -> retry.
- `ERR-EXT-002`: RFC pool above 90% -> throttle and alert.
- `ERR-MAP-001`: required source null -> quarantine.
- `ERR-MAP-002`: invalid date -> correction once, then DLQ.
- `ERR-MAP-003`: unresolved cost centre -> business exception.
- `ERR-LOAD-001`: FinSight 429 -> Retry-After backoff.
- `ERR-LOAD-002`: FinSight 503 -> linear retry, then breaker.
- `ERR-LOAD-003`: FinSight 422 -> business queue.
- `ERR-LOAD-004`: duplicate -> compare payload, skip only if identical.
- `ERR-RECON-001`: count mismatch -> break report and escalation.
- `ERR-SYS-001`: Kafka unavailable -> breaker and P1 alert.
