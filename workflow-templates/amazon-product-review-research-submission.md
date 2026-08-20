# Research Amazon products and reviews by ASIN with Pangolinfo

![Workflow preview](WORKFLOW_IMAGE_URL_TO_ADD_IN_CREATOR_PORTAL)

> This workflow uses the `n8n-nodes-pangolinfo` community node and is compatible with self-hosted n8n only.

## Who’s it for

This workflow is for ecommerce teams, Amazon sellers, product researchers, analysts, and developers who need current product details and buyer reviews for the same ASIN. It supports catalog enrichment, competitive research, product monitoring, and voice-of-customer analysis without maintaining browsers, proxies, or Amazon parsers.

## How it works

The **Configure Research** node keeps the ASIN, Amazon marketplace, ZIP code, review page count, star filter, and sort order in one place. Two Pangolinfo nodes then run in parallel: one retrieves structured product details and the other retrieves recent reviews. The final Merge node combines both responses into one item that can be sent to Google Sheets, a database, a BI dashboard, Slack, or an AI analysis step.

## How to set up

1. Use a self-hosted n8n instance and install `n8n-nodes-pangolinfo` from Community Nodes.
2. [Get a Pangolinfo API key](https://tool.pangolinfo.com/).
3. Create a Pangolinfo API credential in n8n and select it on both Pangolinfo nodes.
4. Edit the values in **Configure Research**, then test the workflow.

Learn more on the [Amazon Scraper API product page](https://www.pangolinfo.com/amazon-scraper-api/) and in the [Amazon API documentation](https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI).

## Requirements

- Self-hosted n8n
- `n8n-nodes-pangolinfo`
- Pangolinfo API key

## How to customize

Change the configured marketplace, review filters, or ASIN. Add storage, alerts, dashboards, or AI nodes after **Combine Product and Reviews** to match your research workflow.
