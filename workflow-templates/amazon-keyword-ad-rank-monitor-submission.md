# Monitor Amazon Organic and Sponsored Keyword Rankings with Pangolinfo

Track a portfolio of Amazon keywords, find one or more target ASINs in current search results, distinguish organic from Sponsored placements, and alert when visibility falls outside your thresholds.

## Who is this for?

Amazon sellers, ecommerce operators, product researchers, SEO/GEO teams, analysts, and automation developers who need current structured data and an actionable report rather than a raw API response.

## What this workflow does

1. Monitor several keywords in one run
2. Measure organic rank and Sponsored/ad rank separately
3. Detect missing target ASINs and lost ad placements
4. Create a daily share-of-search report

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
