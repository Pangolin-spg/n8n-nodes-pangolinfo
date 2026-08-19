# Pangolinfo n8n Workflow Templates

These workflows are sanitized, inactive by default, and contain no API key. Install `n8n-nodes-pangolinfo`, import a JSON file, and select a Pangolinfo API credential on each Pangolinfo node.

## Templates

### Amazon Product and Review Research

Fetch structured product details and recent buyer reviews for one ASIN, then combine both responses for downstream product or voice-of-customer analysis.

- Product: https://www.pangolinfo.com/amazon-scraper-api/
- Documentation: https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI
- File: `amazon-product-review-research.json`

Suggested n8n title: **Research Amazon Products and Reviews by ASIN with Pangolinfo**

### Google AI Overview Monitor

Run a scheduled Google query, retrieve AI Overview content, cited sources, organic results, and an optional screenshot for GEO and brand-visibility monitoring.

- Product: https://www.pangolinfo.com/ai-overview-serp-api/
- Agent Skill: https://www.pangolinfo.com/ai-serp-skill/
- Documentation: https://docs.pangolinfo.com/en-api-reference/aiModeSerpApi/aiModeSerpAPI
- File: `ai-overview-monitor.json`

Suggested n8n title: **Monitor Google AI Overviews and Citations with Pangolinfo**

### Amazon Niche Opportunity Discovery

Filter Amazon niches using search demand and brand-concentration thresholds, then normalize the response for dashboards, spreadsheets, or AI research workflows.

- Product: https://www.pangolinfo.com/amazon-niche-data-api/
- Documentation: https://docs.pangolinfo.com/en-api-reference/nicheFilterAPI/nicheFilterAPI
- File: `amazon-niche-discovery.json`

Suggested n8n title: **Discover High-Demand Amazon Niches with Pangolinfo Market Data**

### Amazon Alexa Recommendation Monitor

Ask Alexa for Shopping a product-discovery prompt and normalize recommended products, follow-up questions, and contextual answers for Amazon AEO monitoring.

- Product: https://www.pangolinfo.com/amazon-alexa-api/
- Documentation: https://docs.pangolinfo.com/en-api-reference/amazonAlexaAPI/amazonAlexaAPI
- File: `amazon-alexa-recommendations.json`

Suggested n8n title: **Track Amazon Alexa for Shopping Recommendations with Pangolinfo**

## Submission notes

- Community nodes are supported by self-hosted n8n. State this clearly in every template submission.
- Do not add real credentials, tokens, customer ASINs, or private queries to exported JSON.
- Use the relevant product landing page as the primary external link and the endpoint documentation as the technical link.
- Keep the template useful without adding unrelated nodes solely to increase keyword coverage.

