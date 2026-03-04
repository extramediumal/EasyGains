# EasyGains Monetization Strategy

> Reference document for pricing, tiers, and unit economics. Implementation deferred to future sprint.

## Pricing

| Plan | Price | Notes |
|------|-------|-------|
| Monthly | $5.99/month | Standard rate |
| Annual | $59/year (~$4.92/month) | 18% discount vs monthly |

## Free vs Pro Tiers

### Free Tier
- 3 voice entries per day
- Basic macro tracking (protein, carbs, fat, calories)
- Best-guess food parsing (no clarification questions)
- No notification reminders

### Pro Tier
- Unlimited voice entries
- Accuracy mode — clarification questions for ambiguous entries
- Weekly analytics and insights
- Customizable notification reminders

## Unit Economics

### Per-User Costs
| Cost | Amount | Notes |
|------|--------|-------|
| Apple commission | 15% | Small Business Program (under $1M revenue) |
| Claude Haiku API | ~$0.35/user/month | Normal usage patterns |
| Supabase | ~$0.05/user/month | At scale |
| **Total cost** | **~$1.30/monthly, ~$1.14/annual** | |

### Net Margin Per User
| Plan | Revenue | Apple Cut | Infra Cost | Net Margin |
|------|---------|-----------|------------|------------|
| Monthly ($5.99) | $5.99 | $0.90 | $0.40 | **~$4.69** |
| Annual ($4.92/mo) | $4.92 | $0.74 | $0.40 | **~$3.78** |
| **Blended** (65% annual / 35% monthly) | | | | **~$4.10/month** |

### Free User Cost
- ~$0.04–0.08/month per free user
- Capped at 3 entries/day, no clarification API calls
- Sustainable at high free-to-paid ratios

## Subscriber Targets

| Milestone | Paying Users Needed | Monthly Revenue |
|-----------|--------------------:|----------------:|
| Break even | ~10 | ~$41 |
| Side income | ~255 | ~$1,000 |
| Full-time income | ~1,230 | ~$5,000 |
| Great income | ~2,450 | ~$10,000 |

*Based on blended margin of ~$4.10/user/month.*

## Implementation Plan (Future)

- **Subscription management:** RevenueCat or expo-in-app-purchases
- **Paywall placement:** After onboarding, on 4th voice entry of the day
- **Free tier enforcement:** Client-side entry count + server-side validation
- **Not building now** — document only until user base validates demand
