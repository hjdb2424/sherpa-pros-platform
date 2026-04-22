# MVP Fixes — Pre-Launch Checklist

## Data Scoping (Critical)
- [ ] Pro job detail: only show materials, photos, checklist for THAT specific job
- [ ] Client job detail: only show bids, assigned pro for THAT specific job
- [ ] Messages: filter conversations by user role + related jobs
- [ ] Earnings: filter transactions/invoices by logged-in pro
- [ ] Reviews: filter by reviewer/reviewee relationship
- [ ] Portfolio: filter by pro ID (not global mock data)
- [ ] Quote: filter by job ID + pro ID

## Auth Scoping
- [ ] API routes should validate user ID on all queries
- [ ] Pro can only see their own jobs, earnings, quotes
- [ ] Client can only see their own jobs, bids, invoices
- [ ] Admin can see everything

## Data Relationships
- [ ] Job → has many Bids → each Bid belongs to one Pro
- [ ] Job → has one assigned Pro (after bid accepted)
- [ ] Job → has one Checklist (generated on bid accept)
- [ ] Job → has one Materials List → has many Items
- [ ] Job → has one Quote (from assigned Pro)
- [ ] Job → has many Messages (between client + assigned pro only)
- [ ] Pro → has many Jobs, Bids, Reviews, Portfolio items
- [ ] Client → has many Jobs, Properties, Reviews given

## When Real DB is Connected
- All mock data filters replaced with WHERE clauses on user_id/job_id
- API routes enforce auth + ownership checks
- No cross-user data leakage
