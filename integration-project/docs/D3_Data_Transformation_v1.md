# D3 Data Transformation and Mapping

Mapping version: `gl-v1`, effective date: 2026-09-20. Amounts retain source currency and GST components; INR reporting amounts use the point-in-time `TCURR` rate.

## General Ledger mappings

| ID | SAP source | FinSight target | Rule | Validation / failure |
| --- | --- | --- | --- | --- |
| MAP-GL-001 | ACDOCA.BUKRS + GJAHR + BELNR | `document_id` | Concatenate company code, year, and left-trimmed document number with `-` | Required, regex; invalid -> DLQ |
| MAP-GL-002 | ACDOCA.BUDAT | `posting_date` | Parse `YYYYMMDD` to ISO 8601 date | Valid date and fiscal-year bound |
| MAP-GL-003 | ACDOCA.BLDAT | `document_date` | Parse `YYYYMMDD` | Must not be after posting date by >30 days |
| MAP-GL-004 | ACDOCA.RACCT | `gl_account` | Left trim zeros, then CoA lookup | Missing mapping -> business exception |
| MAP-GL-005 | ACDOCA.HSL | `amount_lc` | Decimal scale 2 in local currency | Numeric and within configured range |
| MAP-GL-006 | ACDOCA.WSL | `amount_tc` | Decimal scale 2 in transaction currency | Numeric and within configured range |
| MAP-GL-007 | ACDOCA.RHCUR | `local_currency` | Direct map, uppercase | ISO 4217 lookup |
| MAP-GL-008 | ACDOCA.RWCUR | `transaction_currency` | Direct map, uppercase | ISO 4217 lookup |
| MAP-GL-009 | ACDOCA.KOSTL | `cost_centre` | Trim zeros and resolve master-data key | Orphan -> exception queue |
| MAP-GL-010 | ACDOCA.PRCTR | `profit_centre` | Trim zeros and resolve master-data key | Orphan -> exception queue |
| MAP-GL-011 | ACDOCA.MONAT | `fiscal_period` | 001-012 -> month; 013-016 -> month 12 plus special flag | Range 001-016 |
| MAP-GL-012 | ACDOCA.DRCRK | `debit_credit` | `S` -> DEBIT, `H` -> CREDIT | Enum validation |
| MAP-GL-013 | BKPF.BLART | `document_type` | Lookup SAP document type table | Unknown -> DLQ |
| MAP-GL-014 | BKPF.STBLG | `is_reversal` | Non-empty means true | Boolean normalization |
| MAP-GL-015 | ACDOCA.RBUKRS | `company_code` | Direct map to tenant-routing table | Unknown company -> halt domain |
| MAP-GL-016 | ACDOCA.PRCTR + KOSTL | `allocation_key` | Stable SHA-256 of normalized dimensions | Deterministic and non-null |

## Cross-domain rules

- Dates are emitted as `YYYY-MM-DD`; timestamps include `+05:30` where source time is India local time.
- Currency conversion uses the latest `TCURR` rate on or before posting date, with `stale_rate=true` when older than two business days.
- GST fields `cgst_amount`, `sgst_amount`, and `igst_amount` are never merged into a single tax amount.
- Cost-centre and profit-centre hierarchies are flattened into `level_1` through `level_7` without losing the original node key.
- Mandatory nulls, invalid dates, invalid currencies, overflow, and unresolved references are quarantined individually; valid records in the same batch continue.

## Minimum quality rules

`DQ-001` required business key; `DQ-002` ISO date; `DQ-003` ISO currency; `DQ-004` amount scale; `DQ-005` debit-credit enum; `DQ-006` GL master reference; `DQ-007` cost-centre reference; `DQ-008` profit-centre reference; `DQ-009` company-code routing; `DQ-010` fiscal period range; `DQ-011` document-date ordering; `DQ-012` GST component preservation; `DQ-013` duplicate business key; `DQ-014` source lineage; `DQ-015` exchange-rate availability; `DQ-016` no future posting date; `DQ-017` valid vendor GSTIN; `DQ-018` valid customer GSTIN; `DQ-019` non-negative quantity; `DQ-020` valid unit of measure; `DQ-021` PO schedule ordering; `DQ-022` asset-company consistency; `DQ-023` bank statement reference; `DQ-024` supported document type; `DQ-025` payload schema version.
