# Detect Google Keyword Trend Breakouts with Pangolinfo and n8n

Track up to five product keywords in Google Trends, calculate recent momentum from the returned timeline, surface breakout related searches, and alert when demand shifts materially.

## Who is this for?

Amazon sellers, ecommerce operators, product researchers, SEO/GEO teams, analysts, and automation developers who need current structured data and an actionable report rather than a raw API response.

## What this workflow does

1. Compare up to five keywords in one request
2. Calculate recent versus previous-period momentum
3. Extract breakout and rising related queries
4. Create an evidence-based product-demand alert

## Setup

1. Use self-hosted n8n with community nodes enabled.
2. Install `n8n-nodes-pangolinfo`.
3. Create a Pangolinfo API credential and select it on the Pangolinfo node.
4. Edit only **Monitoring Configuration**, then run the manual trigger.
5. Connect SMTP or replace the email node with your preferred alert destination.
6. Activate the schedule only after a successful test.

## Requirements and links

- Product: https://www.pangolinfo.com/ai-overview-serp-api/
- API documentation: https://docs.pangolinfo.com/en-api-reference/trendsApi/keywordTrendsAPI
- Pangolinfo Console: https://tool.pangolinfo.com/
- Community node source: https://github.com/Pangolin-spg/n8n-nodes-pangolinfo

The template is inactive by default, contains no API key, bounds batch size to control credit usage, and surfaces human-readable validation errors.
