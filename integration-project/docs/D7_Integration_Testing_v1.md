# D7 Integration Testing Plan

| ID | Scenario | Expected result |
| --- | --- | --- |
| TST-FNC-001 | ODP GL happy path | 100 records loaded and checksums match |
| TST-FNC-002 | AP items in INR/USD/EUR | Point-in-time INR conversion and ageing pass |
| TST-FNC-003 | Cost-centre master delta | New master appears within one cycle |
| TST-FNC-004 | MC01/MC02/MC03 mixed batch | Correct tenant routing, no cross-contamination |
| TST-FNC-005 | SAP periods 001-016 | 013-016 map to month 12 with special flag |
| TST-FNC-006 | Seven-level hierarchy | All levels flatten without node loss |
| TST-FNC-007 | PO to payment trace | Document chain remains linked |
| TST-FNC-008 | Matched/unmatched bank items | CLEARED and OPEN statuses are correct |
| TST-FNC-009 | Budget versus actual | Variance matches SAP report fixture |
| TST-FNC-010 | End-of-day all-domain reconciliation | Zero breaks or explicit approved exceptions |
| TST-NFR-001 | 500k GL records | Completes within two-hour batch SLA |
| TST-NFR-002 | All domains concurrent | No deadlock and RFC cap respected |
| TST-NFR-003 | 500 concurrent target calls | P95 <5s and expected throttling only |
| TST-NFR-004 | 1k to 100k scale ramp | Throughput scales linearly to ceiling |
| TST-NFR-005 | 24-hour endurance | No leak or connection exhaustion |
| TST-FLR-001 | SAP RFC failure mid-batch | Breaker opens; committed token does not advance |
| TST-FLR-002 | FinSight 429 | Retry-After honored and no duplicate |
| TST-FLR-003 | Kafka broker loss | ISR failover with no message loss |
| TST-FLR-004 | 10 malformed records | 90 succeed and 10 enter DLQ |
| TST-FLR-005 | Five-minute network partition | Buffer and eventual reconciliation |
| TST-SEC-001 | OAuth expiry during load | Refresh once without data loss |
| TST-SEC-002 | Invalid token | 401, audit event, no payload exposure |
| TST-SEC-003 | Encryption verification | TLS 1.2+ in transit and AES-256 at rest |
| TST-REC-001 | INR 1.50 deliberate variance | Break detected and escalated |
| TST-REC-002 | Missing cost centre | Referential rule quarantines record |

Test fixtures must contain synthetic data only. The traceability key is the requirement or rule ID in the test metadata; test results must retain batch ID and correlation ID.
