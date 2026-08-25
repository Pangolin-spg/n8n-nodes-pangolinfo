# Build an Amazon New Release Product Launch Radar with Pangolinfo

Scan several Amazon New Releases categories, normalize newly visible products, score launch traction from rank, rating, reviews, price, and discount signals, and produce a shortlist for competitive or product research.

## Who is this for?

Amazon sellers, ecommerce operators, product researchers, SEO/GEO teams, analysts, and automation developers who need current structured data and an actionable report rather than a raw API response.

## What this workflow does

1. Scan multiple New Releases categories
2. Normalize launch rank, rating, reviews, price, and discount signals
3. Calculate a transparent launch-traction score
4. Alert when high-traction new competitors appear

## Setup

1. Use self-hosted n8n with community nodes enabled.
2. Install `n8n-nodes-pangolinfo`.
3. Create a Pangolinfo API credential and select it on the Pangolinfo node.
4. Edit only **Monitoring Configuration**, then run the manual trigger.
5. Connect SMTP or replace the email node with your preferred alert destination.
6. Activate the schedule only after a successful test.

## Requirements and links

- Product: https://www.pangolinfo.com/amazon-scraper-api/
- API documentation: https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI
- Pangolinfo Console: https://tool.pangolinfo.com/
- Community node source: https://github.com/Pangolin-spg/n8n-nodes-pangolinfo

The template is inactive by default, contains no API key, bounds batch size to control credit usage, and surfaces human-readable validation errors.
