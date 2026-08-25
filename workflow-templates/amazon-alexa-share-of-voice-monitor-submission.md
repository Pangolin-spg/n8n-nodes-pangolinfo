# Monitor Amazon Alexa Shopping Share of Voice with Pangolinfo

Run up to five shopping prompts through Amazon Alexa, normalize recommended products, measure target-brand and target-ASIN presence, and alert when conversational commerce visibility falls below a threshold.

## Who is this for?

Amazon sellers, ecommerce operators, product researchers, SEO/GEO teams, analysts, and automation developers who need current structured data and an actionable report rather than a raw API response.

## What this workflow does

1. Audit several product-discovery prompts in one request
2. Measure brand and ASIN recommendation coverage
3. Capture competing products and follow-up questions
4. Create an Alexa/AEO visibility report

## Setup

1. Use self-hosted n8n with community nodes enabled.
2. Install `n8n-nodes-pangolinfo`.
3. Create a Pangolinfo API credential and select it on the Pangolinfo node.
4. Edit only **Monitoring Configuration**, then run the manual trigger.
5. Connect SMTP or replace the email node with your preferred alert destination.
6. Activate the schedule only after a successful test.

## Requirements and links

- Product: https://www.pangolinfo.com/amazon-alexa-api/
- API documentation: https://docs.pangolinfo.com/en-api-reference/amazonAlexaAPI/amazonAlexaAPI
- Pangolinfo Console: https://tool.pangolinfo.com/
- Community node source: https://github.com/Pangolin-spg/n8n-nodes-pangolinfo

The template is inactive by default, contains no API key, bounds batch size to control credit usage, and surfaces human-readable validation errors.
