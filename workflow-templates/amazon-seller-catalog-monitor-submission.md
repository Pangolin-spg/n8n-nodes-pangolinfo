# Monitor Amazon Competitor Seller Catalogs with Pangolinfo

Track one or more Amazon seller IDs, retrieve their current product catalogs, summarize assortment size and pricing, identify discounted or unavailable items, and alert when catalog risk thresholds are crossed.

## Who is this for?

Amazon sellers, ecommerce operators, product researchers, SEO/GEO teams, analysts, and automation developers who need current structured data and an actionable report rather than a raw API response.

## What this workflow does

1. Monitor multiple competitor seller IDs
2. Summarize assortment, price range, ratings, and discounting
3. Detect small catalogs or high unavailable-product share
4. Create a seller-level competitive intelligence report

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
