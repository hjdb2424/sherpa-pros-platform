# Property Manager Outbound Sequence (B2B)

**Audience:** New England property managers with 1,000+ unit portfolios. Examples: Greater Boston multi-family operators, NH/ME regional PM firms, Boston triple-decker portfolios.
**Goal:** Book a 20-minute demo.
**Cadence:** D0, D4, D9, D17 (4 emails over ~17 days).
**From:** Phyrom (founder) — phyrom@thesherpapros.com.
**Sender voice:** Plainspoken, ROI-forward, respects their time. Writes to a senior operator, not an intern. 8th-grade reading level.
**Brand bible compliance:** Says — Licensed, Verified, Code-aware, Built by a contractor, Local, Jobs not leads. Spells out abbreviations: Net Operating Income (not NOI on first use), Capital Expenditure (not CapEx on first use). Never says — Wiseman, gig, AI-powered as headline, disrupt, jargon abbreviations.

---

## Email 1 — Day 0

**Subject:** {{pm_company}} maintenance vendor management — quick question

**Preview text:** A faster, cheaper alternative to juggling forty contractors in spreadsheets.

**Body:**

Hi {{first_name}},

Phyrom, founder of Sherpa Pros. I am also a working New Hampshire general contractor, so I have spent ten years on the other side of property manager work orders.

Quick question. How many trade vendors does {{pm_company}} have in active rotation across your {{unit_count}} units, and how do you decide who gets the next work order when a heating call comes in at 2 am?

If the honest answer is "a spreadsheet, a group text, and whoever picks up first" — that is exactly the problem we built Sherpa Pros to solve.

What you would get on the platform:

- One inbox for every work order across the portfolio. Tenant-submitted, manager-submitted, recurring.
- Preferred vendor list with a real scorecard — response time, completion time, cost variance, tenant rating. So you stop debating which vendor is actually the best one. The data tells you.
- Unit-level finance: every work order rolled up by property and by unit, with Capital Expenditure versus Operating Expense tagged automatically. Your Net Operating Income reporting gets faster and your auditor stops asking questions.
- Pricing: $4 per unit per month at {{unit_count}} units. Drops to $1.50 per unit at 5,000+ units.

For your portfolio that runs about ${{monthly_price}} a month. Most operators we talk to save more than that in the first month just by cutting the time their site managers spend chasing vendor invoices.

Worth a 20-minute look? Here is my calendar.

[Book 20 minutes with me]({{cal_url}})

Phyrom
Founder, Sherpa Pros
{{phone}}

---

## Email 2 — Day 4

**Subject:** The vendor scorecard, in one screenshot

**Preview text:** This is the report your asset team will actually use.

**Body:**

Hi {{first_name}},

Following up on Sherpa Pros for {{pm_company}}.

I want to show you the one thing that lands hardest in our demos: the vendor scorecard.

[Screenshot — vendor scorecard]({{scorecard_screenshot_url}})

Every vendor in your rotation, ranked by:

- Average response time (in hours)
- Average days to close
- First-time-fix rate
- Cost variance versus your average for that work type
- Tenant satisfaction (1 to 5)

You can sort it any way you want. You can also see the same scorecard at the property level — so your asset manager can see that Property A has a vendor problem while Property B is humming.

The reason this matters: most portfolios I have seen are paying their worst vendor the most. Not because anyone wants that, but because nobody has the data to see it. Once you have the data in front of you, the next vendor renegotiation is a different conversation.

Want to see it on your own portfolio? I can pull a sample report from the demo data in about ten minutes.

[Book 20 minutes]({{cal_url}})

Phyrom

---

## Email 3 — Day 9

**Subject:** What the math looks like for {{unit_count}} units

**Preview text:** Conservative numbers. Real Net Operating Income impact.

**Body:**

Hi {{first_name}},

I get it — every vendor pitch promises savings. So let me put real numbers on the page so you can decide if it is worth the meeting.

For a {{unit_count}}-unit portfolio at typical New England trade rates:

**Cost in:** $4 per unit per month = ${{monthly_price}} per month.

**Savings out, conservative:**

1. **Vendor cost variance.** Operators see a 6 to 11 percent reduction in trade spend in the first 90 days, just from the scorecard surfacing the over-priced vendors. On a typical {{unit_count}}-unit maintenance budget that is roughly ${{vendor_savings}} per year.
2. **Site manager time.** Site managers in our pilots cut work-order-coordination time by 6 to 10 hours a week. At a fully-loaded $35 an hour, that is roughly ${{labor_savings}} per year per site.
3. **Capital Expenditure versus Operating Expense tagging.** Auto-tagged at the work-order level. The audit and tax-prep time savings are hard to put a number on, but every controller we have shown this to has called it the most valuable feature.

Net effect: a $6,500 to $14,000 monthly Net Operating Income improvement on a typical {{unit_count}}-unit portfolio. We charge ${{monthly_price}}.

If those numbers do not work for your portfolio, tell me where they are off and I will redo the math with your actual unit count and trade-spend ratio.

[Book 20 minutes]({{cal_url}})

Phyrom

---

## Email 4 — Day 17

**Subject:** Last note. Tell me to stop or we talk.

**Preview text:** I know your inbox is full. One last try.

**Body:**

Hi {{first_name}},

Last one from me on this thread.

I know your inbox is full and a fourth email from a vendor founder is not what you needed today. But I want to give you a clean way to either pick this up or close it out.

**Three options. Reply with the number.**

1. **Book the demo.** [Calendar]({{cal_url}}). Twenty minutes, screen share, your portfolio numbers live in the demo. I will record it and send you the file so you can share with the asset team.

2. **Send me to your director of operations or maintenance director.** Hit reply with their name and email. I will introduce myself and leave you out of it.

3. **Not now.** Tell me when, and I will mark my calendar to follow up then. No more emails until that date.

Whichever it is — I appreciate you reading this far.

Phyrom
Founder, Sherpa Pros
{{phone}}

PS — If you are wondering why a NH general contractor is selling property management software: I built it for HJD's own work-order intake first, realized the same plumbing solved a much bigger problem for PM operators, and the rest is product.

---

## Notes for the operator

- Use a B2B intent tool (Apollo, Clay, or LinkedIn Sales Navigator export) to pull the prospect list. Filter: New England states, 1,000+ multi-family units, role = VP of Operations / Director of Maintenance / President / Owner.
- All `{{...}}` merge fields require enrichment before send. Do NOT send with placeholder text visible. The math fields (`{{monthly_price}}`, `{{vendor_savings}}`, `{{labor_savings}}`) should be calculated from `{{unit_count}}` using a simple template formula in your sequencer.
- `{{scorecard_screenshot_url}}` should point to a real demo screenshot hosted on the marketing CDN — not a placeholder image.
- Send time: 7:30 am Tuesday or Wednesday. Avoid Mondays (full inbox) and Thursdays-Fridays (mental checkout).
- If they reply at any point, drop them out of the sequence and route to Phyrom directly. PM prospects do not get follow-up emails from a sales bot.
- Track booked-demo rate by company size cohort. Target: 4 percent booked-demo rate on the 1,000-3,000 unit cohort, 7 percent on the 3,000-10,000 cohort, 12 percent on the 10,000+ cohort (the bigger the portfolio, the more the math works).
- After Email 4, move non-responders to quarterly nurture: one well-crafted email per quarter that leads with a new product feature or customer story, not another "checking in" note.
