# Monitor Google AI Overviews and alert on citation gaps with Pangolinfo

> This workflow uses the `n8n-nodes-pangolinfo` community node and requires self-hosted n8n with community nodes enabled.

## Quick overview

This scheduled SEO/GEO monitoring workflow audits multiple Google queries through Pangolinfo, detects AI Overview and citation gaps, scores brand visibility, creates a ranked Markdown portfolio report, and sends an SMTP alert only when configured thresholds fail.

## Who is this for?

SEO, GEO, content, PR, and brand teams that need recurring evidence of whether a brand and domain appear in Google AI Overviews, cited sources, and organic results across a portfolio of commercially important queries.

## What problem does it solve?

Checking AI Overviews manually does not scale and produces inconsistent records. A single-query API example is also not enough for an operational monitoring program. This workflow turns a list of queries into a repeatable audit with scoring, issue explanations, portfolio aggregation, conditional routing, and a ready-to-send alert.

## How it works

1. **Test Workflow Manually** supports safe configuration, while **Every Day at 08:00** runs the production monitor.
2. **Monitoring Configuration** stores newline-separated queries, tracked brand and domain, visibility thresholds, screenshot preference, and alert addresses in one place.
3. **Prepare Search Jobs** validates required fields, expands the query list into individual items, and safely URL-encodes each Google search URL.
4. **Get Google AI Overview** retrieves live AI Overview, source, organic-result, and optional screenshot data through Pangolinfo.
5. **Score Citation Visibility** tolerates multiple response layouts and awards up to 100 points for brand mention, target-domain citation, AI Overview presence, and acceptable organic rank. It records explicit failure reasons for each query.
6. **Build Portfolio Report** sorts weak queries first, calculates the portfolio average and issue count, and produces a Markdown report containing every result.
7. **Visibility Needs Attention?** sends only failing runs to **Email SEO Visibility Alert**; healthy runs return a compact structured summary.

## Setup

1. Use a self-hosted n8n instance with community nodes enabled.
2. Install `n8n-nodes-pangolinfo` from Community Nodes.
3. Create a Pangolinfo API key in the [Pangolinfo Console](https://tool.pangolinfo.com/) and add it as a Pangolinfo credential in n8n.
4. Select that credential on **Get Google AI Overview**.
5. Open **Monitoring Configuration** and replace the example queries, brand, domain, score threshold, organic-position threshold, and sender/recipient addresses.
6. Add an SMTP credential to **Email SEO Visibility Alert**. The [n8n Send Email documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.sendemail/) explains supported SMTP configuration.
7. Run **Test Workflow Manually**, inspect the portfolio report, and activate the workflow only after the values and email routing are correct.

Estimated setup time: 10–15 minutes.

## Requirements

- Self-hosted n8n with community nodes enabled
- `n8n-nodes-pangolinfo`
- Pangolinfo API key
- SMTP credential for email alerts

## Scoring model

- Tracked brand appears in the returned AI/SERP data: 40 points
- Tracked domain appears in an AI Overview citation: 35 points
- An AI Overview is present: 15 points
- Tracked domain ranks within the configured organic limit: 10 points

The score is a transparent workflow heuristic, not a search-engine ranking guarantee. Change the weights in **Score Citation Visibility** if your program prioritizes citations, mentions, or organic rank differently.

## Customization

- Add or remove queries without changing the workflow structure.
- Change the schedule, score threshold, organic-position limit, or screenshot preference.
- Replace SMTP with Slack, Microsoft Teams, Jira, or an incident-management node.
- Persist `results` or `reportMarkdown` in Google Sheets, a database, or an n8n Data Table for long-term trend comparisons.
- Add country/language-specific Google domains if your monitoring program targets other locales.

## Security and operational notes

- No API keys, SMTP credentials, or personal identifiers are included in the template.
- Credentials must be stored in n8n's credential system rather than configuration fields.
- Screenshots can increase credit usage and storage; they are disabled by default.
- The workflow sends email only on the alert branch, reducing notification noise.
- Review queries before activation because each query generates a Pangolinfo API request.

## Additional resources

- [Pangolinfo AI Overview SERP API](https://www.pangolinfo.com/ai-overview-serp-api/)
- [Pangolinfo AI SERP Skill](https://www.pangolinfo.com/ai-serp-skill/)
- [AI Overview SERP API documentation](https://docs.pangolinfo.com/en-api-reference/aiModeSerpApi/serpSubmit)
- [Pangolinfo Console](https://tool.pangolinfo.com/)
- [Official n8n community node source](https://github.com/Pangolin-spg/n8n-nodes-pangolinfo)
