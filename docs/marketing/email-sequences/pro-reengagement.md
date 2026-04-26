# Pro Re-engagement Email Sequence

**Audience:** Pros who signed up but went inactive (no jobs accepted in 30 days).
**Goal:** Get them to take one job. One.
**Cadence:** D30, D34, D40 (3 emails over 10 days, starting on day 30 of inactivity).
**From:** Phyrom (founder).
**Sender voice:** Direct, no guilt-tripping, treat them like an adult. Acknowledge that platforms get installed and forgotten. 8th-grade reading level.
**Brand bible compliance:** Says — Licensed, Verified, Code-aware, Built by a contractor, Local, Jobs not leads. Never says — Wiseman, gig, AI-powered as headline, jargon abbreviations.

---

## Email 1 — Day 30 of inactivity

**Subject:** What is in the way?

**Preview text:** You signed up. You have not taken a job. I want to know why.

**Body:**

Hey {{first_name}},

Phyrom here. You signed up for Sherpa Pros {{signup_days_ago}} days ago and have not accepted a job yet. I want to know what is in the way.

I am not asking to guilt you. Pros sign up for platforms all the time and never come back. Usually it is one of these:

1. The first job that landed in your inbox was outside your service area.
2. The first job was the wrong trade.
3. You forgot the app was on your phone.
4. The bidding flow was confusing and you bounced.
5. You are slammed with HJD-style direct work and do not need more right now.

Hit reply with the number. Just the number. I read every one of these myself and I will fix the actual problem on my end.

If it is number 5, no problem at all. Tell me when to check back in.

Phyrom
{{phone}}

---

## Email 2 — Day 34

**Subject:** Three live jobs in your area, picked by hand

**Preview text:** Picked these so the first job is an easy one.

**Body:**

Hey {{first_name}},

I went into the system and pulled three jobs that match your trade and service area right now. I am sending them to you direct so the first one is an easy yes.

**Job 1:** {{job_1_title}} — {{job_1_distance}} miles from your shop. Budget {{job_1_budget}}. Posted {{job_1_age}}.
[See it]({{job_1_url}})

**Job 2:** {{job_2_title}} — {{job_2_distance}} miles. Budget {{job_2_budget}}. Posted {{job_2_age}}.
[See it]({{job_2_url}})

**Job 3:** {{job_3_title}} — {{job_3_distance}} miles. Budget {{job_3_budget}}. Posted {{job_3_age}}.
[See it]({{job_3_url}})

All three have a checked scope and the homeowner has been verified. License and insurance are already on file from your sign-up, so you can bid in two taps.

If one looks good, bid. If none of them look good, hit reply and tell me what does — I will set up better filters on your account so the next batch is closer to the work you actually want.

One more thing while I have you. We just shipped Sherpa Score, the 0-to-100 quality grade. Your current score is **[CURRENT SCORE]**. You are **[POINTS TO GOLD] points from Gold-tier**, which would drop your take rate to 8 percent and give you 4-hour early access on every job posting before Silver and Bronze pros see it. The 3 metrics that would close the gap fastest for you right now: response time on first message, scope-completion rate on the next 2 jobs, and your first review reply. Take one of the jobs above, do the work clean, and you are most of the way there. Full score breakdown lives at thesherpapros.com/pro/score.

Phyrom

---

## Email 3 — Day 40

**Subject:** One last thing before I let you go

**Preview text:** First-job bonus. No catch.

**Body:**

Hey {{first_name}},

Last try, then I will stop emailing.

If you take one job through Sherpa Pros in the next 14 days, I will personally do these three things:

1. **Drop your take rate to 3 percent** on that first job. Standard founding rate is 5 percent. On the first job you take, it is 3.
2. **Walk-the-job video.** I will drive out (or video-call if you are out of NH) and record a 60-second walk-the-job video at your project. You get the file. Use it on your own website, on Instagram, wherever. No charge.
3. **Phone number on my cell.** You text me directly when something is broken. Real human, real time, no support ticket.

Why am I making this offer? Because the second job is way easier to take than the first. I am willing to spend a little to get you over the first one.

One more thing while I have you. You have earned **[CURRENT POINTS]** Sherpa Rewards points from your beta jobs already. That is **[NEXT REWARD]** away from a free redemption. Take one more job this month and pull the trigger. Sherpa Rewards is the points-redemption store we shipped this quarter — 21 items in the catalog right now (Milwaukee, DeWalt, Festool tools, Visa gift cards, prepaid debit, branded apparel, charity donations). Fulfillment runs through Tremendous, so the redemption is real-world, not a platform credit. Browse the catalog at thesherpapros.com/pro/rewards.

If the reason you went quiet is "I don't have full-time bandwidth right now" — read this paragraph. We just opened thesherpapros.com/flex. It is the side-bandwidth tier. No LLC required. $1M per-project liability insurance is included in the platform fee. Jobs under $5,000. Background-check gate. The whole point of /flex is that you don't have to be full-time to be on the platform — you can take one Saturday job a month and stay on the rails. If that fits where you are right now, click the link, the on-ramp is short.

If the reason you went quiet is "I'm spending too much windshield time at the supply house and can't add platform jobs to my week" — read this paragraph. We just shipped Sherpa Materials. The platform orders what your job needs and Uber Direct drops it on the job site the morning you show up. That's 60 to 90 minutes a day you stop spending in line at FW Webb or Lowe's Pro. Most pros tell me that single change is what made platform jobs profitable — windshield time is the silent margin killer.

[See open jobs in your area]({{jobs_url}})

If this still is not the right time, that is fine. I will move you to a quarterly check-in list and you will not hear from me until {{next_quarter_month}}.

Phyrom
HJD Builders LLC
{{phone}}

---

## Notes for the operator

- Inactivity definition: account is `pro_active=true` AND `last_job_accepted_at` is NULL or older than 30 days.
- Auto-suppress if the pro accepts a job mid-sequence.
- Email 2 is the high-leverage one — it requires a real query against the live jobs table. If no matching jobs exist in their area, hold Email 2 and send a substitute that says "no jobs matched your filters this week, here is what is coming next."
- Email 3 first-job bonus terms (3% take, walk-the-job video, direct cell) need to be wired as a real promo code in the commission engine before this sequence ships. Do not send Email 3 until that is done.
- After Email 3, if no response in 14 days, move to quarterly nurture list (one email per quarter, low-pressure).
- Track conversion as: (pros who accept a job in the 30 days after Email 1 send) / (pros who received Email 1). Target: 12 percent in the first 90 days.
