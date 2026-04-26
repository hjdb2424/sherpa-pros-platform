---
title: International Codes Ingestion — Vendor Evaluation Framework
date: 2026-04-25
status: draft
owner: CEO Phyrom (Phase 4A) / Chief Operating Officer (COO) (Phase 4B+) + Country GM
wave: F — International Country Launch Kits
---

# International Codes Ingestion — Vendor Evaluation Framework

> Framework for evaluating + selecting building-codes ingestion vendors per international country. Feeds the Sherpa codes engine, which is one of the locked Sherpa Pros platform modules (alongside Sherpa Marketplace, Sherpa Hub, Sherpa Materials engine).

## United States baseline (existing — reference only)

| Source | Codes covered | Cost |
|---|---|---|
| **UpCodes** | National Electrical Code (NEC), International Residential Code (IRC), International Building Code (IBC), International Fire Code (IFC), International Plumbing Code (IPC), International Energy Conservation Code (IECC) | Subscription model + Application Programming Interface (API) tier |
| State code databases | All 50 states | Per-state licensing where applicable |
| Municipal data | Major metros via municipal-data partnerships | Custom |

The US baseline is the comparison point for international vendor evaluation. **Goal:** match or exceed United States coverage breadth and update cadence in each international country.

---

## Per-country candidate vendor map

### Canada

| Vendor / source | Covers | Notes |
|---|---|---|
| **Canadian Standards Association (CSA Group)** direct licensing | National Building Code of Canada (NBCC), National Electrical Code Canada (CSA C22.1), National Fire Code (NFC), National Plumbing Code (NPC), Canadian standards (CSA series) | Primary source of truth; commercial license required |
| **Construction Specifications Canada (CSC)** | Cross-reference / specification standards | Useful overlay |
| **LawSource Canada (Westlaw)** | Provincial code aggregator (Ontario Building Code (OBC), British Columbia Building Code (BCBC), Alberta Building Code (ABC), Code de Construction du Québec (CCQ), etc.) | Aggregator licensing |
| **Provincial regulator portals** (Ontario Ministry of Municipal Affairs and Housing, Régie du bâtiment du Québec (RBQ), BC Building and Safety Standards Branch) | Provincial codes + amendments | Direct (often free document download but no API) |
| **Translatewise / similar** | French-to-English translation of CCQ (Quebec) | Translation pipeline vendor |

Detailed Canada runbook: see `08-canada-codes-ingestion-runbook.md`.

### United Kingdom

| Vendor / source | Covers | Notes |
|---|---|---|
| **British Standards Institution (BSI)** direct | British Standards (BS series), BS EN harmonized standards | Primary source; commercial license |
| **Royal Institute of British Architects (RIBA) Knowledge Hub** | Architectural standards + best practice | Subscription |
| **HSE.gov.uk (Health and Safety Executive)** | Construction Design and Management Regulations 2015 (CDM 2015), workplace safety codes | Free public |
| **Building Regulations Approved Documents** (Department for Levelling Up, Housing and Communities (DLUHC)) | Approved Documents A through R (Structure, Fire Safety, Site Preparation, Toxic Substances, Sound, Ventilation, Sanitation, Drainage, Combustion Appliances, Stairs, Conservation of Fuel, Glazing, Electrical Safety, Security) | Free PDF download |
| **London Plan + London Borough plans** | London-specific overlays | Per-borough |
| **Building Safety Act 2022** secondary legislation | Higher-Risk Buildings Regime | Government source |

### Australia

| Vendor / source | Covers | Notes |
|---|---|---|
| **Standards Australia** direct | Australian Standards (AS series), AS/NZS joint standards | Primary source; commercial license |
| **Australian Building Codes Board (ABCB)** | National Construction Code (NCC) Volumes 1-3 | Government; subscription for full content |
| **State regulator portals** (NSW Fair Trading, Victorian Building Authority (VBA), Queensland Building and Construction Commission (QBCC), Building and Energy WA, Consumer and Business Services SA) | State-specific Building Code of Australia (BCA) amendments | Direct (mostly free with Pro Subscriber tier for some) |

### EU pilot — Germany

| Vendor / source | Covers | Notes |
|---|---|---|
| **Deutsches Institut für Normung (DIN)** direct | DIN standards (DIN, DIN EN, DIN EN ISO) | Primary source; commercial license via Beuth Verlag |
| **Per-Bundesland Bauordnung (BauO)** | State building codes — 16 Bundesländer have separate building ordinances | Government PDF; harmonization via Musterbauordnung (MBO — Model Building Code) but each state amends |
| **Comité Européen de Normalisation (CEN)** harmonized standards (EN series) | EU-wide harmonized standards | Available through DIN / national bodies |
| **Handwerkskammer (HWK)** + Zentralverband des Deutschen Handwicks (ZDH) trade-master rules | Meisterbrief requirements per Anlage A trade | Critical for pro vetting (separate from codes) |
| **VDE Verlag** | German electrical standards (DIN VDE) | Specialist; commercial license |

---

## Per-country budget envelope

| Country | Year 1 ingestion | Year 2+ maintenance |
|---|---|---|
| Canada | USD $80,000 – $120,000 | USD $20,000 – $30,000 / year |
| United Kingdom | USD $90,000 – $140,000 | USD $25,000 – $35,000 / year |
| Australia | USD $80,000 – $130,000 | USD $20,000 – $30,000 / year |
| EU pilot (Germany only Year 1) | USD $100,000 – $150,000 | USD $30,000 – $40,000 / year |
| **EU rollout** Year 2+ (per additional EU country) | USD $60,000 – $100,000 | USD $15,000 – $25,000 / year |

**Total Year 1-5 international codes investment: USD $400,000 – $600,000.** Aligns with international plan envelope of $80-150K per country ingestion.

## Evaluation criteria (apply to every vendor)

| Criterion | Weight | What we look for |
|---|---|---|
| **Completeness** | 25% | Coverage of all federal + state/provincial + major-metro codes relevant to construction trades |
| **Update cadence** | 20% | How quickly amendments + new editions reach the dataset (target ≤ 90 days from publication) |
| **Machine-readability** | 20% | Structured data (Extensible Markup Language (XML), JavaScript Object Notation (JSON), or HyperText Markup Language (HTML) with stable selectors) preferred over PDF-only |
| **Licensing terms** | 15% | Per-organization license preferred over per-user; redistribution rights for marketplace context; no per-API-call gouging |
| **API access vs document download** | 10% | Live API > scheduled feed > document download |
| **Customer support + SLA** | 5% | Named account manager, technical onboarding support, SLA on data freshness |
| **Localization** | 5% | Native-language ingestion + (where applicable) English translation pipeline |

**Pass threshold: weighted score ≥ 70% across all criteria.** Country GM owns the evaluation, COO signs off.

## Recommended sourcing strategy

1. **Lead with direct relationships** with the national standards body in each country (CSA Group, BSI, Standards Australia, DIN). These are the source of truth and the best long-term partnership.
2. **Supplement with aggregator services** (LawSource Canada, RIBA Knowledge Hub) where licensing is favorable and machine-readability is better than the source body.
3. **Use government free-tier sources** (HSE.gov.uk, DLUHC Approved Documents, Bundesland BauO PDFs) where commercial licensing is unjustified for the coverage value.
4. **Build internal ingestion pipeline** to normalize all sources into the Sherpa codes engine schema, regardless of source format.
5. **Translation pipeline** for non-English source material (CCQ in French, German DIN standards, future EU rollout languages).

## Decision authority

- **Single-country vendor selections ≤ USD $50,000/year:** Country GM + Engineering Lead joint signoff.
- **Single-country vendor selections > USD $50,000/year:** COO signoff.
- **Multi-country master agreements (e.g., a global aggregator that covers 3+ countries):** CEO Phyrom + COO joint signoff.

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| National standards body refuses commercial license for marketplace use | Engage early (12+ months before launch); offer revenue share or attribution; fall back to aggregator |
| Per-user licensing makes marketplace economics unworkable | Negotiate per-organization or per-API-call license up front in master agreement |
| Code editions change mid-launch and break Sherpa codes engine | 90-day re-ingestion checks + automated diff alerts on every source |
| Translation quality (Quebec French → English, German → English) is poor | Use specialist construction-translation vendor + native-translator review for trade-specific nomenclature |
| Bundesland-by-Bundesland fragmentation in Germany costs more than expected | Phase Bundesland coverage by metro launch; defer non-metro Bundesländer |

---

*This framework is reused per country. Country GM tailors to local market and submits vendor selections to COO for approval.*
