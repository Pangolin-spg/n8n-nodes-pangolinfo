# Score Amazon Niche Opportunities with Pangolinfo Market Data

Filter Amazon niches by demand and concentration, normalize the returned market metrics, calculate a transparent opportunity score, rank candidates, and alert when strong product-selection opportunities appear.

## Who is this for?

Amazon sellers, ecommerce operators, product researchers, SEO/GEO teams, analysts, and automation developers who need current structured data and an actionable report rather than a raw API response.

## What this workflow does

1. Apply demand and brand-concentration filters
2. Score and rank niche opportunities transparently
3. Expose the metrics behind every recommendation
4. Produce a short product-research shortlist

## Setup

1. Use self-hosted n8n with community nodes enabled.
2. Install `n8n-nodes-pangolinfo`.
3. Create a Pangolinfo API credential and select it on the Pangolinfo node.
4. Edit only **Monitoring Configuration**, then run the manual trigger.
5. Connect SMTP or replace the email node with your preferred alert destination.
6. Activate the schedule only after a successful test.

## Requirements and links

- Product: https://www.pangolinfo.com/amazon-niche-data-api/
- API documentation: https://docs.pangolinfo.com/en-api-reference/nicheFilterAPI/nicheFilterAPI
- Pangolinfo Console: https://tool.pangolinfo.com/
- Community node source: https://github.com/Pangolin-spg/n8n-nodes-pangolinfo

The template is inactive by default, contains no API key, bounds batch size to control credit usage, and surfaces human-readable validation errors.
