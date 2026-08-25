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

Audit multiple Google queries on a schedule, score AI Overview brand and citation visibility, aggregate a ranked portfolio report, and send an SMTP alert only when configured thresholds fail.

- Product: https://www.pangolinfo.com/ai-overview-serp-api/
- Agent Skill: https://www.pangolinfo.com/ai-serp-skill/
- Documentation: https://docs.pangolinfo.com/en-api-reference/aiModeSerpApi/serpSubmit
- File: `ai-overview-monitor.json`

Suggested n8n title: **Monitor Google AI Overviews and Alert on Citation Gaps with Pangolinfo**

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

## Advanced monitoring portfolio

The following nine workflows share a production-oriented structure: manual and scheduled triggers, centralized configuration, bounded job creation, a Pangolinfo data step, normalized metrics, threshold evaluation, a Markdown portfolio report, and conditional email alerting. Each contains four explanatory Sticky Notes and ten execution nodes.

| Workflow | Primary outcome | Product |
|---|---|---|
| `amazon-keyword-ad-rank-monitor.json` | Track organic and Sponsored positions for target ASINs across keywords | Amazon Scraper API |
| `amazon-competitor-price-stock-monitor.json` | Monitor competitor price, availability, rating, coupon, and seller signals | Amazon Scraper API |
| `amazon-review-complaint-monitor.json` | Measure low-star share and recurring complaint phrases across ASINs | Amazon Scraper API / Reviews |
| `google-keyword-breakout-monitor.json` | Detect keyword momentum and breakout related searches | Keyword Trends API |
| `amazon-niche-opportunity-scorecard.json` | Rank product-selection niches with a transparent opportunity score | Amazon Niche Data API |
| `amazon-seller-catalog-monitor.json` | Summarize competitor seller assortment, pricing, discounts, and availability | Amazon Scraper API |
| `amazon-alexa-share-of-voice-monitor.json` | Measure brand and ASIN recommendation coverage across Alexa prompts | Amazon Alexa API |
| `amazon-best-seller-rank-monitor.json` | Track Best Sellers brand share and owned-ASIN rank | Amazon Scraper API |
| `amazon-new-release-launch-radar.json` | Score high-traction new product launches by category | Amazon Scraper API |

Each JSON has a matching `-submission.md` file containing n8n Creator Portal copy, setup instructions, requirements, and canonical product/docs links.

## Submission notes

- Community nodes are supported by self-hosted n8n. State this clearly in every template submission.
- Do not add real credentials, tokens, customer ASINs, or private queries to exported JSON.
- Use the relevant product landing page as the primary external link and the endpoint documentation as the technical link.
- Keep the template useful without adding unrelated nodes solely to increase keyword coverage.
