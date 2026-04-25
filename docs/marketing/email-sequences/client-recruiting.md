# Client Recruiting Email Sequence (HJD Existing Clients)

**Audience:** HJD Builders existing clients onboarding to Sherpa Pros.
**Goal:** Get them to post their first job (or save Sherpa Pros for the next time they need a trade).
**Cadence:** D0, D3, D7 (3 emails over 7 days).
**From:** Phyrom directly (NOT a marketing alias — phyrom@hjd.builders for email 1, then phyrom@thesherpapros.com for emails 2-3).
**Sender voice:** First person, conversational, you-already-know-me. Plainspoken, 8th-grade reading level.
**Brand bible compliance:** Says — Licensed, Verified, Code-aware, Built by a contractor, Local, Jobs not leads. Never says — Wiseman, gig, AI-powered as headline, disrupt, jargon abbreviations.

---

## Email 1 — Day 0

**Subject:** You know me from HJD. Here is what I built.

**Preview text:** A new way to find a licensed pro for the smaller jobs HJD does not take.

**Body:**

Hi {{first_name}},

You know me from HJD Builders. We have worked together on {{project_reference}}, and I appreciate that.

I want to tell you about something else I built.

You probably have a list. Stuff around the house that is too small for HJD to take on but too important to call a random handyman from Google. A bathroom faucet that has been dripping for a year. A deck board that is rotting. The garbage disposal that died last summer. The heat pump quote you have been meaning to get.

That is what Sherpa Pros is for.

It is a new platform I built for licensed trade work — national in scope, launching here at home first. Same standard you got from HJD. Every pro on it is license-checked, insurance-checked, and code-aware. You post the job in a few words, you get bids from real local pros, and you only pay when the work is done. No card to post, no fees, no spam.

It is live now in the Seacoast and rolling out across Manchester, Portland, and Boston specialty trades — with more metros coming.

You are getting the link before it opens to the public. If you have a project on your list, post it and see what comes back.

[Post a job — free]({{post_job_url}})

If you have questions, just reply. This goes straight to me.

Phyrom
HJD Builders LLC
Founder, Sherpa Pros

---

## Email 2 — Day 3

**Subject:** What "code-aware" means for your house

**Preview text:** Why we check every quote before it lands in your inbox.

**Body:**

Hi {{first_name}},

Quick follow-up.

You have probably had this happen. You get three quotes for a job, two are reasonable, one is shockingly cheap. You go with the cheap one. Six months later you find out the work was not done to code, the inspector failed it, and now you are paying twice.

Sherpa Pros stops that.

Every quote that comes through the platform is checked against your town's building code, the state code, and the national code (NEC for electrical, IRC for residential). If a pro has left out a permit, skipped a panel upgrade that the heat pump needs, or under-scoped the work, you see that before you accept the bid.

You stop being the test case. You only see clean, complete bids.

That is the part of Sherpa Pros I am proudest of. It is the same scope review I do at HJD before I sign off on a sub. Now you get it on every job, even the small ones.

[Post a job and see how it works]({{post_job_url}})

Phyrom

---

## Email 3 — Day 7

**Subject:** Save the link, no rush

**Preview text:** Last note. Bookmark Sherpa Pros for whenever you need a pro.

**Body:**

Hi {{first_name}},

Last one from me.

If you do not have a project right now, that is fine. The reason I am writing one more time is that the worst time to find a contractor is when you actually need one. Burst pipe at 11 pm. Roof leak in a storm. AC out in August.

Save the link now. The day you need it, you will be glad you did.

Bookmark this:
[thesherpapros.com]({{home_url}})

Or download the app:
- [iPhone]({{ios_url}})
- [Android]({{android_url}})

Two reasons it works in an emergency:
1. Twenty-four-seven dispatch. Licensed pros on call for water, fire, mold, and storm damage.
2. We hold the payment until you say the work is done right. So if a pro shows up at midnight and does a bad patch, you have leverage.

You already know how I work at HJD. Sherpa Pros is the same standard, scaled to all the smaller stuff.

Thanks again for being a long-time HJD client. That trust is the whole reason I had the runway to build this.

Phyrom
HJD Builders LLC
Founder, Sherpa Pros
{{phone}}

---

## Notes for the operator

- Email 1 sends from `phyrom@hjd.builders` to preserve the existing relationship and inboxing reputation. Emails 2 and 3 transition to `phyrom@thesherpapros.com`. Set up SPF/DKIM on both.
- `{{project_reference}}` should be hand-filled if possible (the actual project HJD did for them). If not available, use "your project" as a fallback.
- Send time: 9:00 am local. Higher open rates for residential audience versus the 7:15 am pro send time.
- If they post a job after Email 1, drop them out of the sequence and trigger the post-job nurture flow.
- If they reply, all replies route to Phyrom's personal inbox, not a support queue. This is a high-trust list — protect it.
- Suppress this list from any other marketing send for 30 days after the sequence completes.
