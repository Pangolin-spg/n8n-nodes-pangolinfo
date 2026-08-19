# n8n-nodes-pangolinfo

Official n8n community nodes for [Pangolinfo](https://www.pangolinfo.com/) — real-time Amazon, Alexa for Shopping, AI SERP, niche, and category data without maintaining proxies, browsers, or page selectors.

## Operations

- Amazon product details, keyword search, reviews, seller catalog, Best Sellers, and New Releases
- Amazon Alexa for Shopping prompts and recommendations
- Google AI Overview and keyword trends
- Amazon niche and category filtering
- Custom Pangolinfo API requests for advanced endpoints

## Installation

In n8n, open **Settings → Community Nodes**, choose **Install**, and enter:

```text
n8n-nodes-pangolinfo
```

For self-hosted testing:

```bash
npm install n8n-nodes-pangolinfo
```

## Credentials

1. [Create a Pangolinfo account and API key](https://tool.pangolinfo.com/).
2. In n8n, create a **Pangolinfo API** credential.
3. Paste the permanent API key. The node sends it only as a Bearer authorization header to `scrapeapi.pangolinfo.com`.

New accounts include free test requests. Calls consume Pangolinfo credits according to the selected endpoint.

## Useful links

| Capability | Pangolinfo product |
| --- | --- |
| Amazon product details, search, reviews, sellers, Best Sellers, and New Releases | [Amazon Scraper API](https://www.pangolinfo.com/amazon-scraper-api/) |
| Alexa for Shopping prompts and recommendations | [Amazon Alexa API](https://www.pangolinfo.com/amazon-alexa-api/) |
| Niche research and category filters | [Amazon Niche Data API](https://www.pangolinfo.com/amazon-niche-data-api/) |
| Agent and MCP workflows | [Amazon Data MCP](https://www.pangolinfo.com/amazon-data-mcp/) |
| Google AI Overview results | [AI Overview SERP API](https://www.pangolinfo.com/ai-overview-serp-api/) |
| Google keyword interest data | [Keyword Trends API documentation](https://docs.pangolinfo.com/en-api-reference/trendsApi/keywordTrendsAPI) |

- [Pangolinfo product overview](https://www.pangolinfo.com/)
- [Complete API documentation](https://docs.pangolinfo.com/en-index)

## Ready-to-import workflow templates

The repository includes four sanitized n8n workflows. They contain no API keys and prompt for a Pangolinfo credential after import:

- [Amazon product and review research](workflow-templates/amazon-product-review-research.json)
- [Google AI Overview monitor](workflow-templates/ai-overview-monitor.json)
- [Amazon niche opportunity discovery](workflow-templates/amazon-niche-discovery.json)
- [Amazon Alexa recommendation monitor](workflow-templates/amazon-alexa-recommendations.json)

See [workflow-templates/README.md](workflow-templates/README.md) for setup, product links, and submission-ready descriptions.

## License

Integration source code is licensed under MIT. Pangolinfo names, logos, and brand assets are not granted under the MIT license; see [BRANDING.md](BRANDING.md).
