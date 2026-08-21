# Monitor Google AI Overviews and citations with Pangolinfo

> This workflow uses the `n8n-nodes-pangolinfo` community node and is compatible with self-hosted n8n only.

## Quick overview

This scheduled workflow monitors a Google query with Pangolinfo, retrieves the current AI Overview, citations, organic results, and optional screenshot, then creates a normalized record for GEO and brand-visibility analysis.

## How it works

1. Every 24 Hours starts a scheduled monitoring run.
2. Configure Monitoring supplies the target Google search URL and screenshot preference.
3. Get Google AI Overview requests structured generative search and organic result data through Pangolinfo.
4. Normalize AI Visibility Record extracts the task ID, AI Overview, organic results, screenshot, timestamp, and canonical product source into a consistent output for storage, comparison, dashboards, alerts, or downstream AI analysis.

## Setup

1. Use a self-hosted n8n instance with community nodes enabled.
2. Install `n8n-nodes-pangolinfo` from Community Nodes.
3. Create a Pangolinfo API key in the Pangolinfo Console and add it as a Pangolinfo credential in n8n.
4. Select that credential on Get Google AI Overview.
5. Update the Google search URL and screenshot option in Configure Monitoring, test the workflow, and then activate its schedule.

## Requirements

- Self-hosted n8n with community nodes enabled; `n8n-nodes-pangolinfo`; and a Pangolinfo API key.

## Customization

- Change the query, schedule, or screenshot preference. Connect the normalized result to Google Sheets, a database, Slack, email, a dashboard, or an AI step to compare citation, content, and brand-visibility changes over time.

## Additional info

This workflow uses a community node and is compatible with self-hosted n8n only. Learn more about the [Pangolinfo AI Overview SERP API](https://www.pangolinfo.com/ai-overview-serp-api/), use the [Pangolinfo AI SERP Skill](https://www.pangolinfo.com/ai-serp-skill/), read the [AI Overview API documentation](https://docs.pangolinfo.com/en-api-reference/aiModeSerpApi/aiModeSerpAPI), and get an API key in the [Pangolinfo Console](https://tool.pangolinfo.com/).
