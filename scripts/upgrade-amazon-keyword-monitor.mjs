import fs from 'node:fs';
import path from 'node:path';

const target = path.resolve('workflow-templates/amazon-keyword-ad-rank-monitor.json');
const workflow = JSON.parse(fs.readFileSync(target, 'utf8'));

const id = (value) => value;
const sticky = (nodeId, name, content, position, width, height, color = 7) => ({
  id: nodeId,
  name,
  type: 'n8n-nodes-base.stickyNote',
  typeVersion: 1,
  position,
  parameters: { content, width, height, color },
});

const code = (nodeId, name, jsCode, position, mode) => ({
  id: nodeId,
  name,
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position,
  parameters: mode ? { mode, jsCode } : { jsCode },
});

workflow.name = 'Track Amazon Organic and Sponsored Rank Changes with History and Deduplicated Alerts';
workflow.nodes = [
  sticky(
    id('973a4f42-96f1-4ea8-a39e-8fe87ff32201'),
    'Workflow overview',
    `## Track Amazon organic and Sponsored rank changes with history

This production-oriented monitor checks multiple Amazon keywords and target ASINs, separates organic and Sponsored positions, compares every observation with the previous successful scheduled run, tracks breach streaks, measures competitor share of shelf, and suppresses duplicate alerts during a configurable cooldown.

### How it works

1. Run a manual data-quality test or activate the daily schedule.
2. Validate the watchlist and create one bounded API job per keyword.
3. Retrieve live Amazon search results and calculate target/competitor visibility.
4. Compare each keyword + ASIN pair with workflow static history, classify drops, recoveries, missing listings, ad loss and threshold breaches, then update the snapshot.
5. Build an audit-ready portfolio report. Only new or cooldown-expired critical events send an immediate email; an optional healthy daily digest is handled separately.

### Setup

1. Use self-hosted n8n and install the \`n8n-nodes-pangolinfo\` community node.
2. Add Pangolinfo credentials to **Search Amazon Keyword**.
3. Replace all values in **Monitoring Configuration** and connect SMTP credentials to both email nodes.
4. Run **Test Workflow Manually** to validate response parsing. Static history is persisted by successful active/scheduled executions, so activate the workflow before evaluating day-over-day changes.

### Operational safeguards

- Maximum 20 keywords per run; duplicate keywords and ASINs are removed.
- First observations create a baseline and do not generate drop alerts.
- Alert fingerprints plus cooldown prevent repeated notifications for an unchanged incident.
- The structured dashboard output can be connected to Google Sheets, Airtable, Notion, BigQuery or a warehouse without changing the monitoring logic.

[Amazon Scraper API](https://www.pangolinfo.com/amazon-scraper-api/) · [Amazon API documentation](https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI) · [n8n community node](https://github.com/Pangolin-spg/n8n-nodes-pangolinfo)`,
    [-620, -1320],
    3740,
    820,
    4,
  ),
  sticky(
    id('b1edab65-716b-4fa8-8d68-2c80ef657c02'),
    'Configuration guide',
    '## 1. Trigger and validate\n\nEdit the watchlist, marketplace, thresholds, competitor ASINs, cooldown and recipients. Manual and scheduled runs share the same validated configuration.',
    [-620, -420],
    820,
    1120,
  ),
  sticky(
    id('2e3be241-b928-444c-9215-6100590eab03'),
    'Collection guide',
    '## 2. Collect live search data\n\nOne request is made per keyword. Results are normalized once, then reused to score every target ASIN and competitor without duplicate API calls.',
    [260, -420],
    900,
    1120,
  ),
  sticky(
    id('a3b46f49-4276-4470-ad87-c256eef24f04'),
    'History guide',
    '## 3. Compare with history\n\nThe state engine calculates rank deltas, breach streaks, recoveries and competitor share of shelf. New fingerprints and cooldowns control alert noise.',
    [1220, -420],
    900,
    1120,
  ),
  sticky(
    id('ae9d0c25-ff02-454e-9315-9cc3460b6f05'),
    'Reporting guide',
    '## 4. Route actionable output\n\nBuild one portfolio report, send only deduplicated critical alerts, optionally send a healthy digest, and expose structured rows for a dashboard or warehouse.',
    [2180, -420],
    940,
    1120,
  ),
  {
    id: id('b4237ac3-6649-4b5f-ae1c-c36bf0552101'),
    name: 'Test Workflow Manually',
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: [-500, 80],
    parameters: {},
  },
  {
    id: id('44ace648-c295-4d43-b03b-a668bb7a2102'),
    name: 'Every Day at 08:00',
    type: 'n8n-nodes-base.scheduleTrigger',
    typeVersion: 1.2,
    position: [-500, 280],
    parameters: {
      rule: { interval: [{ field: 'days', daysInterval: 1, triggerAtHour: 8 }] },
    },
  },
  {
    id: id('1714ebea-2efc-4aac-8a1c-caf5cd8e2103'),
    name: 'Monitoring Configuration',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [-160, 180],
    parameters: {
      assignments: {
        assignments: [
          { id: id('c1010000-0000-4000-8000-000000000001'), name: 'keywords', value: 'noise cancelling headphones\nwireless travel headphones\nover ear bluetooth headphones', type: 'string' },
          { id: id('c1010000-0000-4000-8000-000000000002'), name: 'trackedAsins', value: 'B0DYTF8L2W', type: 'string' },
          { id: id('c1010000-0000-4000-8000-000000000003'), name: 'competitorAsins', value: 'B076CLQDR4,B0B7CQ2CHH', type: 'string' },
          { id: id('c1010000-0000-4000-8000-000000000004'), name: 'site', value: 'amz_us', type: 'string' },
          { id: id('c1010000-0000-4000-8000-000000000005'), name: 'zipcode', value: '10041', type: 'string' },
          { id: id('c1010000-0000-4000-8000-000000000006'), name: 'maxOrganicRank', value: 20, type: 'number' },
          { id: id('c1010000-0000-4000-8000-000000000007'), name: 'maxSponsoredRank', value: 10, type: 'number' },
          { id: id('c1010000-0000-4000-8000-000000000008'), name: 'organicDropThreshold', value: 5, type: 'number' },
          { id: id('c1010000-0000-4000-8000-000000000009'), name: 'sponsoredDropThreshold', value: 3, type: 'number' },
          { id: id('c1010000-0000-4000-8000-000000000010'), name: 'requireSponsoredPresence', value: true, type: 'boolean' },
          { id: id('c1010000-0000-4000-8000-000000000011'), name: 'alertCooldownHours', value: 24, type: 'number' },
          { id: id('c1010000-0000-4000-8000-000000000012'), name: 'sendHealthyDailyDigest', value: false, type: 'boolean' },
          { id: id('c1010000-0000-4000-8000-000000000013'), name: 'alertFromEmail', value: 'Pangolinfo Monitor <alerts@example.com>', type: 'string' },
          { id: id('c1010000-0000-4000-8000-000000000014'), name: 'alertToEmail', value: 'ecommerce-team@example.com', type: 'string' },
        ],
      },
      options: {},
    },
  },
  code(
    id('04fd3730-2110-48cc-a5b4-46ea82542104'),
    'Validate and Expand Watchlist',
    `const config = $json;
const unique = (values) => [...new Set(values)];
const keywords = unique(String(config.keywords ?? '').split(/\\r?\\n/).map((v) => v.trim()).filter(Boolean));
const trackedAsins = unique(String(config.trackedAsins ?? '').split(/[\\s,]+/).map((v) => v.trim().toUpperCase()).filter(Boolean));
const competitorAsins = unique(String(config.competitorAsins ?? '').split(/[\\s,]+/).map((v) => v.trim().toUpperCase()).filter(Boolean));
if (!keywords.length) throw new Error('Add at least one Amazon keyword.');
if (!trackedAsins.length) throw new Error('Add at least one target ASIN.');
if (keywords.length > 20) throw new Error('Use at most 20 unique keywords per run to control API usage.');
if (trackedAsins.some((asin) => !/^B[A-Z0-9]{9}$/.test(asin))) throw new Error('Every target ASIN must use the 10-character Amazon ASIN format.');
const numbers = ['maxOrganicRank', 'maxSponsoredRank', 'organicDropThreshold', 'sponsoredDropThreshold', 'alertCooldownHours'];
for (const field of numbers) if (!Number.isFinite(Number(config[field])) || Number(config[field]) < 0) throw new Error(field + ' must be a non-negative number.');
return keywords.map((keyword) => ({ json: { ...config, keyword, trackedAsins, competitorAsins, monitorKey: String(config.site) + '|' + keyword.toLowerCase() } }));`,
    [360, 180],
  ),
  {
    id: id('a7ac440c-96f0-4b39-b54b-a29995072105'),
    name: 'Search Amazon Keyword',
    type: 'n8n-nodes-pangolinfo.pangolinfo',
    typeVersion: 1,
    position: [660, 180],
    parameters: {
      resource: 'amazon',
      operation: 'amazonSearch',
      keyword: '={{ $json.keyword }}',
      site: '={{ $json.site }}',
      zipcode: '={{ $json.zipcode }}',
    },
    onError: 'continueRegularOutput',
  },
  code(
    id('34b1e63c-139c-487e-a5e4-58b3c7972106'),
    'Normalize Target and Competitor Visibility',
    `const job = $('Validate and Expand Watchlist').item.json;
const response = $json;
const apiFailed = Boolean(response.error || response.errorMessage || response.code && Number(response.code) !== 0);
const payload = response.data ?? response;
const data = payload.json ?? payload.data?.json ?? payload;
const products = [data, data?.items, data?.products, data?.results, data?.searchResults].find(Array.isArray) ?? [];
const normalized = products.map((product, index) => ({
  asin: String(product.asin ?? product.asinId ?? product.productId ?? '').toUpperCase(),
  sponsored: Boolean(product.sponsored ?? product.isSponsored ?? product.ad ?? /sponsor/i.test(String(product.badge ?? product.label ?? ''))),
  position: Number(product.position ?? product.rank ?? index + 1),
  title: product.title ?? product.name ?? null,
})).filter((product) => product.asin);
const positionsFor = (asin, sponsored) => normalized.filter((product) => product.asin === asin && product.sponsored === sponsored).map((product) => product.position);
const rankFor = (asin, sponsored) => {
  const positions = positionsFor(asin, sponsored);
  return positions.length ? Math.min(...positions) : null;
};
const targetMetrics = job.trackedAsins.map((asin) => ({
  asin,
  organicRank: rankFor(asin, false),
  sponsoredRank: rankFor(asin, true),
  title: normalized.find((product) => product.asin === asin)?.title ?? null,
}));
const competitorMetrics = job.competitorAsins.map((asin) => ({ asin, organicRank: rankFor(asin, false), sponsoredRank: rankFor(asin, true) }));
const topTwenty = normalized.filter((product) => product.position <= 20);
const competitorPlacements = topTwenty.filter((product) => job.competitorAsins.includes(product.asin)).length;
return { json: {
  ...job,
  checkedAt: new Date().toISOString(),
  apiFailed,
  apiError: response.errorMessage ?? response.error?.message ?? (apiFailed ? String(response.message ?? 'Pangolinfo request failed') : null),
  resultCount: normalized.length,
  targetMetrics,
  competitorMetrics,
  competitorShareOfShelf: topTwenty.length ? Number((competitorPlacements / topTwenty.length * 100).toFixed(1)) : 0,
} };`,
    [960, 180],
    'runOnceForEachItem',
  ),
  code(
    id('adeb9d34-3f32-44f9-88fc-0f5d95602107'),
    'Compare History and Classify Events',
    `const store = $getWorkflowStaticData('global');
store.amazonRankHistory ??= {};
const now = new Date();
const output = [];
for (const item of $input.all()) {
  const current = item.json;
  for (const metric of current.targetMetrics) {
    const stateKey = [current.site, current.keyword.toLowerCase(), metric.asin].join('|');
    const previous = store.amazonRankHistory[stateKey] ?? null;
    const reasons = [];
    const events = [];
    const organicDrop = previous?.organicRank != null && metric.organicRank != null ? metric.organicRank - previous.organicRank : null;
    const sponsoredDrop = previous?.sponsoredRank != null && metric.sponsoredRank != null ? metric.sponsoredRank - previous.sponsoredRank : null;
    if (current.apiFailed) reasons.push('API request failed: ' + current.apiError);
    if (!current.apiFailed && metric.organicRank == null) reasons.push('Target missing from organic results');
    if (metric.organicRank != null && metric.organicRank > Number(current.maxOrganicRank)) reasons.push('Organic rank ' + metric.organicRank + ' exceeds limit ' + current.maxOrganicRank);
    if (previous?.organicRank != null && metric.organicRank == null) events.push('organic_lost');
    if (organicDrop != null && organicDrop >= Number(current.organicDropThreshold)) events.push('organic_drop');
    if (organicDrop != null && organicDrop <= -Number(current.organicDropThreshold)) events.push('organic_recovery');
    if (Boolean(current.requireSponsoredPresence) && !current.apiFailed && metric.sponsoredRank == null) reasons.push('No Sponsored placement detected');
    if (metric.sponsoredRank != null && metric.sponsoredRank > Number(current.maxSponsoredRank)) reasons.push('Sponsored rank ' + metric.sponsoredRank + ' exceeds limit ' + current.maxSponsoredRank);
    if (previous?.sponsoredRank != null && metric.sponsoredRank == null) events.push('sponsored_lost');
    if (sponsoredDrop != null && sponsoredDrop >= Number(current.sponsoredDropThreshold)) events.push('sponsored_drop');
    if (sponsoredDrop != null && sponsoredDrop <= -Number(current.sponsoredDropThreshold)) events.push('sponsored_recovery');
    const breached = reasons.length > 0;
    const recovered = Boolean(previous?.breached && !breached);
    if (recovered) events.push('threshold_recovery');
    const breachStreak = breached ? Number(previous?.breachStreak ?? 0) + 1 : 0;
    const severity = current.apiFailed || metric.organicRank == null ? 'critical' : breached || events.includes('organic_drop') || events.includes('sponsored_lost') ? 'warning' : recovered ? 'recovered' : 'healthy';
    const incidentSignals = [...reasons.sort(), ...events.filter((event) => !event.includes('recovery')).sort()];
    const fingerprint = [severity, ...incidentSignals].join('|');
    const lastAlertAt = previous?.lastAlertAt ? new Date(previous.lastAlertAt) : null;
    const cooldownElapsed = !lastAlertAt || now.getTime() - lastAlertAt.getTime() >= Number(current.alertCooldownHours) * 3600000;
    const previousFingerprint = String(previous?.lastAlertFingerprint ?? '');
    const previousSignals = new Set(previousFingerprint.split('|').slice(1));
    const containsNewSignal = incidentSignals.some((signal) => !previousSignals.has(signal));
    const severityEscalated = severity === 'critical' && !previousFingerprint.startsWith('critical|');
    const fingerprintChanged = !previousFingerprint || containsNewSignal || severityEscalated;
    const notificationDue = Boolean(previous) && ['critical', 'warning'].includes(severity) && (fingerprintChanged || cooldownElapsed);
    const nextState = {
      checkedAt: current.checkedAt,
      organicRank: metric.organicRank,
      sponsoredRank: metric.sponsoredRank,
      breached,
      breachStreak,
      lastAlertAt: previous?.lastAlertAt ?? null,
      lastAlertFingerprint: previous?.lastAlertFingerprint ?? null,
    };
    store.amazonRankHistory[stateKey] = nextState;
    output.push({ json: {
      ...current,
      ...metric,
      targetMetrics: undefined,
      stateKey,
      hasBaseline: Boolean(previous),
      previousOrganicRank: previous?.organicRank ?? null,
      previousSponsoredRank: previous?.sponsoredRank ?? null,
      organicDrop,
      sponsoredDrop,
      reasons,
      events,
      breached,
      recovered,
      breachStreak,
      severity,
      alertFingerprint: fingerprint,
      notificationDue,
    } });
  }
}
return output;`,
    [1320, 180],
  ),
  code(
    id('12907132-8ab1-4ccb-a886-83eb079e2108'),
    'Build Portfolio Intelligence Report',
    `const rows = $input.all().map((item) => item.json);
if (!rows.length) throw new Error('No target ranking rows were produced.');
const issues = rows.filter((row) => row.notificationDue);
const activeBreaches = rows.filter((row) => row.breached);
const recoveries = rows.filter((row) => row.recovered || row.events.includes('organic_recovery') || row.events.includes('sponsored_recovery'));
const baselines = rows.filter((row) => !row.hasBaseline);
const organicRanks = rows.map((row) => row.organicRank).filter(Number.isFinite);
const sponsoredVisible = rows.filter((row) => Number.isFinite(row.sponsoredRank)).length;
const avgOrganicRank = organicRanks.length ? Number((organicRanks.reduce((sum, rank) => sum + rank, 0) / organicRanks.length).toFixed(1)) : null;
const avgCompetitorShare = Number((rows.reduce((sum, row) => sum + Number(row.competitorShareOfShelf ?? 0), 0) / rows.length).toFixed(1));
const rank = (value) => value == null ? 'not found' : String(value);
const delta = (value) => value == null ? 'baseline' : value > 0 ? 'down ' + value : value < 0 ? 'up ' + Math.abs(value) : 'unchanged';
const table = rows.map((row) => '| ' + row.keyword + ' | ' + row.asin + ' | ' + rank(row.organicRank) + ' (' + delta(row.organicDrop) + ') | ' + rank(row.sponsoredRank) + ' (' + delta(row.sponsoredDrop) + ') | ' + row.severity + ' | ' + (row.reasons.join('; ') || row.events.join(', ') || 'Healthy') + ' |');
const reportMarkdown = [
  '# Amazon organic and Sponsored rank intelligence',
  '',
  'Checked: ' + new Date().toISOString(),
  'Keyword × ASIN observations: ' + rows.length,
  'New baselines: ' + baselines.length,
  'Active breaches: ' + activeBreaches.length,
  'New/cooldown-expired alerts: ' + issues.length,
  'Recoveries: ' + recoveries.length,
  'Average organic rank: ' + (avgOrganicRank ?? 'not found'),
  'Sponsored coverage: ' + Number((sponsoredVisible / rows.length * 100).toFixed(1)) + '%',
  'Competitor share of top-20 shelf: ' + avgCompetitorShare + '%',
  '',
  '| Keyword | Target ASIN | Organic | Sponsored | Severity | Findings |',
  '| --- | --- | --- | --- | --- | --- |',
  ...table,
  '',
  'Product: https://www.pangolinfo.com/amazon-scraper-api/',
  'Docs: https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI',
].join('\\n');
return [{ json: {
  checkedAt: new Date().toISOString(),
  observationCount: rows.length,
  baselineCount: baselines.length,
  breachCount: activeBreaches.length,
  alertCount: issues.length,
  recoveryCount: recoveries.length,
  avgOrganicRank,
  sponsoredCoveragePercent: Number((sponsoredVisible / rows.length * 100).toFixed(1)),
  competitorShareOfShelfPercent: avgCompetitorShare,
  alertRequired: issues.length > 0,
  dailyDigestDue: Boolean(rows[0].sendHealthyDailyDigest) && issues.length === 0,
  issues,
  rows,
  reportMarkdown,
  alertFromEmail: rows[0].alertFromEmail,
  alertToEmail: rows[0].alertToEmail,
} }];`,
    [1640, 180],
  ),
  {
    id: id('ee4521d6-0e56-40d0-8a16-bbd677b52109'),
    name: 'New Actionable Alert?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [2260, 40],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [{ id: id('f4bcdb7e-6b00-40b3-ae9f-d671251c2110'), leftValue: '={{ $json.alertRequired }}', rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
        combinator: 'and',
      },
      options: {},
    },
  },
  {
    id: id('d3eb1aaa-3a35-473e-9dc5-0398a2212111'),
    name: 'Email Deduplicated Rank Alert',
    type: 'n8n-nodes-base.emailSend',
    typeVersion: 2.1,
    position: [2540, -80],
    parameters: {
      fromEmail: '={{ $json.alertFromEmail }}',
      toEmail: '={{ $json.alertToEmail }}',
      subject: '=[Amazon Rank Alert] {{ $json.alertCount }} new or repeated incidents',
      emailFormat: 'text',
      text: '={{ $json.reportMarkdown }}',
      options: { appendAttribution: false },
    },
  },
  code(
    id('e634031c-b392-411e-8eaa-34e0c9952112'),
    'Acknowledge Successful Alerts',
    `const report = $('Build Portfolio Intelligence Report').first().json;
const store = $getWorkflowStaticData('global');
store.amazonRankHistory ??= {};
const sentAt = new Date().toISOString();
for (const issue of report.issues) {
  if (!store.amazonRankHistory[issue.stateKey]) continue;
  store.amazonRankHistory[issue.stateKey].lastAlertAt = sentAt;
  store.amazonRankHistory[issue.stateKey].lastAlertFingerprint = issue.alertFingerprint;
}
return [{ json: { status: 'alert_sent', sentAt, alertCount: report.alertCount, reportMarkdown: report.reportMarkdown } }];`,
    [2820, -80],
  ),
  {
    id: id('93f31d1b-b5d5-4f1a-870c-4be7c9992113'),
    name: 'No Immediate Alert',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [2540, 160],
    parameters: {
      assignments: { assignments: [
        { id: id('96d69fac-3ba8-43ce-ac6c-00e4dd812114'), name: 'status', value: 'no_new_alert', type: 'string' },
        { id: id('0cc9262f-9bde-4e7c-8091-6cf061912115'), name: 'message', value: '=No new or cooldown-expired incident. {{ $json.breachCount }} active breaches remain in the report.', type: 'string' },
        { id: id('5a09013f-f54d-4779-80c8-e879bab12116'), name: 'reportMarkdown', value: '={{ $json.reportMarkdown }}', type: 'string' },
      ] },
      options: {},
    },
  },
  {
    id: id('18d82d69-4792-4122-a750-dc410db42117'),
    name: 'Healthy Daily Digest Enabled?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2.2,
    position: [2260, 400],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [{ id: id('c9b70f71-1321-49f8-bb40-4a7a38612118'), leftValue: '={{ $json.dailyDigestDue }}', rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
        combinator: 'and',
      },
      options: {},
    },
  },
  {
    id: id('a5e40874-4813-4b4c-8d06-d677be092119'),
    name: 'Email Healthy Daily Digest',
    type: 'n8n-nodes-base.emailSend',
    typeVersion: 2.1,
    position: [2540, 400],
    parameters: {
      fromEmail: '={{ $json.alertFromEmail }}',
      toEmail: '={{ $json.alertToEmail }}',
      subject: '=[Amazon Rank Digest] {{ $json.observationCount }} observations, no new alerts',
      emailFormat: 'text',
      text: '={{ $json.reportMarkdown }}',
      options: { appendAttribution: false },
    },
  },
  {
    id: id('7912723c-b0a8-4170-aa55-3e83b2ff2120'),
    name: 'Structured Dashboard Output',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [1960, 580],
    parameters: {
      assignments: { assignments: [
        { id: id('5443712d-12a7-48e0-89fb-71a8eb172121'), name: 'checkedAt', value: '={{ $json.checkedAt }}', type: 'string' },
        { id: id('03462821-ffcf-4b2f-9541-4646f5982122'), name: 'observationCount', value: '={{ $json.observationCount }}', type: 'number' },
        { id: id('a447af07-5525-405b-a8a3-ad1363c72123'), name: 'breachCount', value: '={{ $json.breachCount }}', type: 'number' },
        { id: id('c201dc3b-b610-401f-a489-035ece232124'), name: 'recoveryCount', value: '={{ $json.recoveryCount }}', type: 'number' },
        { id: id('4bdf50ac-3072-43ae-b132-5b10d6b32125'), name: 'avgOrganicRank', value: '={{ $json.avgOrganicRank }}', type: 'number' },
        { id: id('394f3d27-6f68-4314-8f72-6ab60cf42126'), name: 'sponsoredCoveragePercent', value: '={{ $json.sponsoredCoveragePercent }}', type: 'number' },
        { id: id('1a2b0f84-b74e-43c1-bbc9-7fa77ff22127'), name: 'competitorShareOfShelfPercent', value: '={{ $json.competitorShareOfShelfPercent }}', type: 'number' },
        { id: id('c1a33a87-0d05-45da-bc08-b7dd98122128'), name: 'rows', value: '={{ $json.rows }}', type: 'array' },
      ] },
      options: {},
    },
  },
];

workflow.connections = {
  'Test Workflow Manually': { main: [[{ node: 'Monitoring Configuration', type: 'main', index: 0 }]] },
  'Every Day at 08:00': { main: [[{ node: 'Monitoring Configuration', type: 'main', index: 0 }]] },
  'Monitoring Configuration': { main: [[{ node: 'Validate and Expand Watchlist', type: 'main', index: 0 }]] },
  'Validate and Expand Watchlist': { main: [[{ node: 'Search Amazon Keyword', type: 'main', index: 0 }]] },
  'Search Amazon Keyword': { main: [[{ node: 'Normalize Target and Competitor Visibility', type: 'main', index: 0 }]] },
  'Normalize Target and Competitor Visibility': { main: [[{ node: 'Compare History and Classify Events', type: 'main', index: 0 }]] },
  'Compare History and Classify Events': { main: [[{ node: 'Build Portfolio Intelligence Report', type: 'main', index: 0 }]] },
  'Build Portfolio Intelligence Report': { main: [[
    { node: 'New Actionable Alert?', type: 'main', index: 0 },
    { node: 'Healthy Daily Digest Enabled?', type: 'main', index: 0 },
    { node: 'Structured Dashboard Output', type: 'main', index: 0 },
  ]] },
  'New Actionable Alert?': { main: [
    [{ node: 'Email Deduplicated Rank Alert', type: 'main', index: 0 }],
    [{ node: 'No Immediate Alert', type: 'main', index: 0 }],
  ] },
  'Email Deduplicated Rank Alert': { main: [[{ node: 'Acknowledge Successful Alerts', type: 'main', index: 0 }]] },
  'Healthy Daily Digest Enabled?': { main: [
    [{ node: 'Email Healthy Daily Digest', type: 'main', index: 0 }],
    [],
  ] },
};

workflow.active = false;
workflow.settings = workflow.settings ?? { executionOrder: 'v1' };
workflow.meta = workflow.meta ?? { templateCredsSetupCompleted: false };
workflow.tags = workflow.tags ?? [];

fs.writeFileSync(target, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(`Upgraded ${target} with ${workflow.nodes.length} nodes.`);
