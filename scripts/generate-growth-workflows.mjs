import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('workflow-templates');

function id(seed) {
  const hex = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function sticky(slug, name, content, position, size, color) {
  return {
    parameters: { content, height: size[1], width: size[0], color },
    id: id(`${slug}:${name}`), name, type: 'n8n-nodes-base.stickyNote', typeVersion: 1, position,
  };
}

function manual(slug) {
  return { parameters: {}, id: id(`${slug}:manual`), name: 'Test Workflow Manually', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [-360, -40] };
}

function schedule(slug) {
  return {
    parameters: { rule: { interval: [{ field: 'days', daysInterval: 1, triggerAtHour: 8 }] } },
    id: id(`${slug}:schedule`), name: 'Every Day at 08:00', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [-360, 100],
  };
}

function setNode(slug, assignments) {
  return {
    parameters: { assignments: { assignments: assignments.map((entry, index) => ({ id: id(`${slug}:config:${index}`), ...entry })) }, options: {} },
    id: id(`${slug}:config`), name: 'Monitoring Configuration', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [-80, 20],
  };
}

function codeNode(slug, key, name, jsCode, position, each = false) {
  return {
    parameters: { ...(each ? { mode: 'runOnceForEachItem' } : {}), jsCode },
    id: id(`${slug}:${key}`), name, type: 'n8n-nodes-base.code', typeVersion: 2, position,
  };
}

function pangNode(slug, name, parameters, position = [500, 20]) {
  return { parameters, id: id(`${slug}:pangolinfo:${name}`), name, type: 'n8n-nodes-pangolinfo.pangolinfo', typeVersion: 1, position };
}

function ifNode(slug) {
  return {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
        conditions: [{ id: id(`${slug}:if-condition`), leftValue: '={{ $json.alertRequired }}', rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
        combinator: 'and',
      }, options: {},
    },
    id: id(`${slug}:if`), name: 'Attention Required?', type: 'n8n-nodes-base.if', typeVersion: 2.2, position: [1340, 20],
  };
}

function emailNode(slug, subjectPrefix) {
  return {
    parameters: {
      fromEmail: '={{ $json.alertFromEmail }}', toEmail: '={{ $json.alertToEmail }}',
      subject: `=[${subjectPrefix}] {{ $json.issueCount }} monitored items need attention`,
      emailFormat: 'text', text: '={{ $json.reportMarkdown }}', options: { appendAttribution: false },
    },
    id: id(`${slug}:email`), name: 'Email Monitoring Alert', type: 'n8n-nodes-base.emailSend', typeVersion: 2.1, position: [1640, -80],
  };
}

function healthyNode(slug) {
  return {
    parameters: {
      assignments: { assignments: [
        { id: id(`${slug}:healthy:0`), name: 'status', value: 'healthy', type: 'string' },
        { id: id(`${slug}:healthy:1`), name: 'message', value: '=All {{ $json.itemCount }} monitored items passed the configured thresholds.', type: 'string' },
        { id: id(`${slug}:healthy:2`), name: 'reportMarkdown', value: '={{ $json.reportMarkdown }}', type: 'string' },
      ] }, options: {},
    },
    id: id(`${slug}:healthy`), name: 'Healthy Run Summary', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [1640, 120],
  };
}

const aggregateCode = String.raw`const rows = $input.all().map((item) => item.json);
if (rows.length === 0) throw new Error('No monitoring results were returned.');
const issues = rows.filter((row) => row.alertRequired || (row.alertReasons ?? []).length > 0);
const lines = rows.map((row) => '| ' + String(row.monitorKey ?? row.asin ?? row.keyword ?? row.sellerId ?? 'item') + ' | ' + String(row.metricSummary ?? '') + ' | ' + ((row.alertReasons ?? []).join('; ') || 'Healthy') + ' |');
const reportMarkdown = [
  '# ' + String(rows[0].reportTitle ?? 'Pangolinfo monitoring report'),
  '',
  'Checked: ' + new Date().toISOString(),
  'Items checked: ' + rows.length,
  'Items requiring attention: ' + issues.length,
  '',
  '| Item | Current metrics | Status |',
  '| --- | --- | --- |',
  ...lines,
  '',
  'Product: ' + String(rows[0].productUrl ?? 'https://www.pangolinfo.com/')
].join('\n');
return [{ json: {
  checkedAt: new Date().toISOString(), alertRequired: issues.length > 0,
  itemCount: rows.length, issueCount: issues.length, issues, rows, reportMarkdown,
  alertFromEmail: rows[0].alertFromEmail, alertToEmail: rows[0].alertToEmail
} }];`;

function standardWorkflow(spec) {
  const { slug } = spec;
  const nodes = [
    sticky(slug, 'Workflow overview', `## ${spec.heading}\n\n${spec.overview}\n\n### Business outcome\n${spec.outcomes.map((item) => `- ${item}`).join('\n')}\n\nThis template requires self-hosted n8n with the \`n8n-nodes-pangolinfo\` community node enabled.\n\n[Product page](${spec.productUrl}) · [API documentation](${spec.docsUrl})`, [-460, -620], [1180, 500], 4),
    sticky(slug, 'Configuration guide', `## 1. Configure the monitor\n\nEdit only **Monitoring Configuration**. Replace all sample identifiers, thresholds, marketplace settings, and email addresses. Select a Pangolinfo credential on the orange node.\n\nUse **Test Workflow Manually** first. Activate the daily schedule only after the output matches your monitoring goal.`, [-420, 300], [720, 330], 7),
    sticky(slug, 'Analysis guide', `## 2. Collect and analyze\n\n**Prepare Monitoring Jobs** validates the input and creates bounded API jobs. **${spec.apiNodeName}** retrieves current structured data. **Analyze Current Data** normalizes response variations, calculates the use-case metrics, and records human-readable alert reasons.`, [520, 300], [880, 330], 5),
    sticky(slug, 'Reporting guide', `## 3. Aggregate and alert\n\n**Build Monitoring Report** produces one Markdown portfolio report. Only failed thresholds reach **Email Monitoring Alert**; healthy executions still return a structured summary.\n\nConnect SMTP or replace the final alert node with Slack, Teams, Jira, a database, or a data warehouse.`, [1500, 300], [850, 330], 6),
    manual(slug), schedule(slug), setNode(slug, spec.assignments),
    codeNode(slug, 'prepare', 'Prepare Monitoring Jobs', spec.prepareCode, [220, 20]),
    pangNode(slug, spec.apiNodeName, spec.apiParameters),
    codeNode(slug, 'analyze', 'Analyze Current Data', spec.analyzeCode, [780, 20], true),
    codeNode(slug, 'aggregate', 'Build Monitoring Report', aggregateCode, [1060, 20]),
    ifNode(slug), emailNode(slug, spec.subjectPrefix), healthyNode(slug),
  ];
  const connections = {
    'Test Workflow Manually': { main: [[{ node: 'Monitoring Configuration', type: 'main', index: 0 }]] },
    'Every Day at 08:00': { main: [[{ node: 'Monitoring Configuration', type: 'main', index: 0 }]] },
    'Monitoring Configuration': { main: [[{ node: 'Prepare Monitoring Jobs', type: 'main', index: 0 }]] },
    'Prepare Monitoring Jobs': { main: [[{ node: spec.apiNodeName, type: 'main', index: 0 }]] },
    [spec.apiNodeName]: { main: [[{ node: 'Analyze Current Data', type: 'main', index: 0 }]] },
    'Analyze Current Data': { main: [[{ node: 'Build Monitoring Report', type: 'main', index: 0 }]] },
    'Build Monitoring Report': { main: [[{ node: 'Attention Required?', type: 'main', index: 0 }]] },
    'Attention Required?': { main: [[{ node: 'Email Monitoring Alert', type: 'main', index: 0 }], [{ node: 'Healthy Run Summary', type: 'main', index: 0 }]] },
  };
  return { name: spec.name, nodes, connections, pinData: {}, active: false, settings: { executionOrder: 'v1' }, versionId: id(`${slug}:version`), meta: { templateCredsSetupCompleted: false }, tags: [] };
}

const emailAssignments = [
  { name: 'alertFromEmail', value: 'Pangolinfo Monitor <alerts@example.com>', type: 'string' },
  { name: 'alertToEmail', value: 'ecommerce-team@example.com', type: 'string' },
];

const specs = [
  {
    slug: 'amazon-keyword-ad-rank-monitor',
    name: 'Monitor Amazon Organic and Sponsored Keyword Rankings with Pangolinfo',
    heading: 'Amazon organic and sponsored keyword rank monitor',
    overview: 'Track a portfolio of Amazon keywords, find one or more target ASINs in current search results, distinguish organic from Sponsored placements, and alert when visibility falls outside your thresholds.',
    outcomes: ['Monitor several keywords in one run', 'Measure organic rank and Sponsored/ad rank separately', 'Detect missing target ASINs and lost ad placements', 'Create a daily share-of-search report'],
    productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI', subjectPrefix: 'Amazon Rank Alert',
    assignments: [
      { name: 'keywords', value: 'noise cancelling headphones\nwireless travel headphones\nover ear bluetooth headphones', type: 'string' },
      { name: 'trackedAsins', value: 'B0DYTF8L2W', type: 'string' },
      { name: 'site', value: 'amz_us', type: 'string' }, { name: 'zipcode', value: '10041', type: 'string' },
      { name: 'maxOrganicRank', value: 20, type: 'number' }, { name: 'maxSponsoredRank', value: 10, type: 'number' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json;
const keywords = String(config.keywords ?? '').split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
const trackedAsins = String(config.trackedAsins ?? '').split(/[\s,]+/).map((v) => v.trim().toUpperCase()).filter(Boolean);
if (!keywords.length) throw new Error('Add at least one Amazon keyword.');
if (!trackedAsins.length) throw new Error('Add at least one target ASIN.');
if (keywords.length > 20) throw new Error('Use at most 20 keywords per run to control API usage.');
return keywords.map((keyword) => ({ json: { ...config, keyword, trackedAsins, monitorKey: keyword } }));`,
    apiNodeName: 'Search Amazon Keyword', apiParameters: { resource: 'amazon', operation: 'amazonSearch', keyword: '={{ $json.keyword }}', site: '={{ $json.site }}', zipcode: '={{ $json.zipcode }}' },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json;
const payload = $json.data ?? $json;
const data = payload.json ?? payload.data?.json ?? payload;
const products = [data, data?.items, data?.products, data?.results, data?.searchResults].find(Array.isArray) ?? [];
const norm = products.map((p, i) => ({ asin: String(p.asin ?? p.asinId ?? p.productId ?? '').toUpperCase(), sponsored: Boolean(p.sponsored ?? p.isSponsored ?? p.ad ?? /sponsor/i.test(String(p.badge ?? p.label ?? ''))), position: Number(p.position ?? p.rank ?? i + 1), title: p.title ?? p.name ?? null }));
const matches = norm.filter((p) => job.trackedAsins.includes(p.asin));
const organic = matches.filter((p) => !p.sponsored).map((p) => p.position);
const sponsored = matches.filter((p) => p.sponsored).map((p) => p.position);
const bestOrganicRank = organic.length ? Math.min(...organic) : null;
const bestSponsoredRank = sponsored.length ? Math.min(...sponsored) : null;
const alertReasons = [];
if (bestOrganicRank === null) alertReasons.push('Target ASIN missing from organic results');
else if (bestOrganicRank > Number(job.maxOrganicRank)) alertReasons.push('Organic rank below target: ' + bestOrganicRank);
if (bestSponsoredRank === null) alertReasons.push('No Sponsored placement detected');
else if (bestSponsoredRank > Number(job.maxSponsoredRank)) alertReasons.push('Sponsored rank below target: ' + bestSponsoredRank);
return { json: { ...job, checkedAt: new Date().toISOString(), bestOrganicRank, bestSponsoredRank, matchedListings: matches, alertRequired: alertReasons.length > 0, alertReasons, metricSummary: 'organic=' + (bestOrganicRank ?? 'not found') + ', sponsored=' + (bestSponsoredRank ?? 'not found'), reportTitle: 'Amazon keyword and ad rank report', productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/' } };`,
  },
  {
    slug: 'amazon-competitor-price-stock-monitor',
    name: 'Monitor Amazon Competitor Prices Stock and Ratings with Pangolinfo',
    heading: 'Amazon competitor price, stock, and rating monitor',
    overview: 'Check several competitor ASINs daily, normalize price and availability signals, compare each product with configurable price and rating thresholds, and alert on material changes.',
    outcomes: ['Track multiple competitor ASINs', 'Normalize price, availability, rating, review count, coupon, and seller', 'Flag price moves and out-of-stock products', 'Produce a portfolio report for pricing decisions'],
    productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI', subjectPrefix: 'Competitor Alert',
    assignments: [
      { name: 'asins', value: 'B0DYTF8L2W\nB0CAMPLE01\nB0CAMPLE02', type: 'string' }, { name: 'site', value: 'amz_us', type: 'string' }, { name: 'zipcode', value: '10041', type: 'string' },
      { name: 'minimumPrice', value: 15, type: 'number' }, { name: 'maximumPrice', value: 80, type: 'number' }, { name: 'minimumRating', value: 4, type: 'number' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json;
const asins = String(config.asins ?? '').split(/\r?\n|,/).map((v) => v.trim().toUpperCase()).filter(Boolean);
if (!asins.length) throw new Error('Add at least one competitor ASIN.');
if (asins.length > 25) throw new Error('Use at most 25 ASINs per run.');
return asins.map((asin) => ({ json: { ...config, asin, monitorKey: asin } }));`,
    apiNodeName: 'Get Competitor Product', apiParameters: { resource: 'amazon', operation: 'amazonProduct', asin: '={{ $json.asin }}', site: '={{ $json.site }}', zipcode: '={{ $json.zipcode }}' },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json;
const payload = $json.data ?? $json; const raw = payload.json ?? payload.data?.json ?? payload; const p = Array.isArray(raw) ? (raw[0] ?? {}) : raw;
const priceText = String(p.price ?? p.currentPrice ?? p.buyBoxPrice ?? '').replace(/,/g, '');
const priceMatch = priceText.match(/\d+(?:\.\d+)?/); const price = priceMatch ? Number(priceMatch[0]) : null;
const rating = Number(String(p.star ?? p.rating ?? p.score ?? '').match(/\d+(?:\.\d+)?/)?.[0] ?? NaN);
const availabilityText = String(p.availability ?? p.stock ?? p.delivery ?? '').toLowerCase();
const inStock = !/unavailable|out of stock|currently unavailable/.test(availabilityText);
const alertReasons = [];
if (!inStock) alertReasons.push('Product appears unavailable');
if (price === null) alertReasons.push('Price not returned');
else { if (price < Number(job.minimumPrice)) alertReasons.push('Price below floor: ' + price); if (price > Number(job.maximumPrice)) alertReasons.push('Price above ceiling: ' + price); }
if (Number.isFinite(rating) && rating < Number(job.minimumRating)) alertReasons.push('Rating below threshold: ' + rating);
return { json: { ...job, title: p.title ?? null, price, currency: p.currency ?? null, inStock, availabilityText, rating: Number.isFinite(rating) ? rating : null, reviewCount: p.ratingsCount ?? p.reviewCount ?? null, coupon: p.coupon ?? null, seller: p.seller ?? null, alertRequired: alertReasons.length > 0, alertReasons, metricSummary: 'price=' + (price ?? 'n/a') + ', stock=' + inStock + ', rating=' + (Number.isFinite(rating) ? rating : 'n/a'), reportTitle: 'Amazon competitor price and stock report', productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/' } };`,
  },
  {
    slug: 'amazon-review-complaint-monitor',
    name: 'Monitor Amazon Review Complaints and Rating Risk with Pangolinfo',
    heading: 'Amazon review complaint and rating-risk monitor',
    overview: 'Collect recent reviews for several ASINs, calculate the low-star share, detect configurable complaint phrases, summarize recurring topics, and alert product or customer-experience teams.',
    outcomes: ['Monitor several owned or competitor ASINs', 'Calculate negative-review share from recent feedback', 'Detect recurring complaint themes without an external AI model', 'Route only threshold breaches to an alert'],
    productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/amazonReviewAPI/amazonReviewAPI', subjectPrefix: 'Review Risk',
    assignments: [
      { name: 'asins', value: 'B0DYTF8L2W\nB0CAMPLE01', type: 'string' }, { name: 'site', value: 'amz_us', type: 'string' }, { name: 'pageCount', value: 1, type: 'number' },
      { name: 'complaintPhrases', value: 'broke,poor quality,too small,missing,late,refund,not working', type: 'string' }, { name: 'maximumNegativeShare', value: 0.25, type: 'number' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json;
const asins = String(config.asins ?? '').split(/\r?\n|,/).map((v) => v.trim().toUpperCase()).filter(Boolean);
if (!asins.length) throw new Error('Add at least one ASIN.');
if (asins.length > 15) throw new Error('Use at most 15 ASINs per run.');
const complaintPhrases = String(config.complaintPhrases ?? '').split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
return asins.map((asin) => ({ json: { ...config, asin, complaintPhrases, monitorKey: asin } }));`,
    apiNodeName: 'Get Recent Amazon Reviews', apiParameters: { resource: 'amazon', operation: 'amazonReviews', asin: '={{ $json.asin }}', site: '={{ $json.site }}', pageCount: '={{ $json.pageCount }}', starFilter: 'all_stars', reviewSort: 'recent' },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json; const payload = $json.data ?? $json; const raw = payload.json ?? payload.data?.json ?? payload;
const reviews = [raw, raw?.items, raw?.reviews, raw?.data].find(Array.isArray) ?? [];
const normalized = reviews.map((r) => { const rating = Number(String(r.rating ?? r.star ?? r.score ?? '').match(/\d+(?:\.\d+)?/)?.[0] ?? NaN); const text = String(r.content ?? r.body ?? r.text ?? r.title ?? '').toLowerCase(); return { rating: Number.isFinite(rating) ? rating : null, text, title: r.title ?? null, date: r.date ?? r.reviewDate ?? null }; });
const rated = normalized.filter((r) => r.rating !== null); const negative = rated.filter((r) => r.rating <= 2); const negativeShare = rated.length ? negative.length / rated.length : 0;
const topicCounts = Object.fromEntries(job.complaintPhrases.map((phrase) => [phrase, normalized.filter((r) => r.text.includes(phrase)).length]).filter(([, count]) => count > 0));
const alertReasons = []; if (!reviews.length) alertReasons.push('No reviews returned'); if (negativeShare > Number(job.maximumNegativeShare)) alertReasons.push('Negative review share is ' + Math.round(negativeShare * 100) + '%'); if (Object.keys(topicCounts).length) alertReasons.push('Complaint phrases detected: ' + Object.keys(topicCounts).join(', '));
return { json: { ...job, reviewCount: reviews.length, ratedReviewCount: rated.length, negativeReviewCount: negative.length, negativeShare, topicCounts, sampleNegativeReviews: negative.slice(0, 5), alertRequired: alertReasons.length > 0, alertReasons, metricSummary: 'reviews=' + reviews.length + ', negative=' + Math.round(negativeShare * 100) + '%, topics=' + Object.keys(topicCounts).length, reportTitle: 'Amazon review risk report', productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/' } };`,
  },
  {
    slug: 'google-keyword-breakout-monitor',
    name: 'Detect Google Keyword Trend Breakouts with Pangolinfo and n8n',
    heading: 'Google keyword trend and breakout monitor',
    overview: 'Track up to five product keywords in Google Trends, calculate recent momentum from the returned timeline, surface breakout related searches, and alert when demand shifts materially.',
    outcomes: ['Compare up to five keywords in one request', 'Calculate recent versus previous-period momentum', 'Extract breakout and rising related queries', 'Create an evidence-based product-demand alert'],
    productUrl: 'https://www.pangolinfo.com/ai-overview-serp-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/trendsApi/keywordTrendsAPI', subjectPrefix: 'Keyword Trend',
    assignments: [
      { name: 'keywords', value: 'portable fan,neck fan,desk fan', type: 'string' }, { name: 'region', value: 'US', type: 'string' }, { name: 'timeRange', value: 'today 12-m', type: 'string' }, { name: 'minimumMomentumPercent', value: 20, type: 'number' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json; const keywords = String(config.keywords ?? '').split(',').map((v) => v.trim()).filter(Boolean);
if (!keywords.length || keywords.length > 5) throw new Error('Provide between one and five comma-separated keywords.');
return [{ json: { ...config, keywords, monitorKey: keywords.join(', ') } }];`,
    apiNodeName: 'Get Google Keyword Trends', apiParameters: { resource: 'ai', operation: 'keywordTrends', trendKeywords: '={{ $json.keywords.join(",") }}', region: '={{ $json.region }}', timeRange: '={{ $json.timeRange }}' },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json; const payload = $json.data ?? $json; const data = payload.json ?? payload.data?.json ?? payload;
const timeline = Array.isArray(data.timelineData) ? data.timelineData : []; const width = job.keywords.length;
const points = timeline.map((p) => Array.isArray(p.value) ? p.value.map(Number) : []).filter((v) => v.length >= width);
const recent = points.slice(-4); const previous = points.slice(-8, -4); const avg = (rows, i) => rows.length ? rows.reduce((s, r) => s + (Number(r[i]) || 0), 0) / rows.length : 0;
const momentum = job.keywords.map((keyword, i) => { const current = avg(recent, i); const prior = avg(previous, i); const percent = prior > 0 ? ((current - prior) / prior) * 100 : (current > 0 ? 100 : 0); return { keyword, current: Math.round(current), previous: Math.round(prior), momentumPercent: Math.round(percent) }; });
const ranks = Array.isArray(data.keywordsRankData) ? data.keywordsRankData : []; const breakoutQueries = ranks.flatMap((row) => (row.rankList ?? []).flatMap((group) => group.rankedKeyword ?? []).filter((q) => /breakout/i.test(String(q.formattedValue ?? ''))).map((q) => ({ keyword: row.keyword, query: q.query, value: q.formattedValue })));
const rising = momentum.filter((m) => Math.abs(m.momentumPercent) >= Number(job.minimumMomentumPercent)); const alertReasons = rising.map((m) => m.keyword + ' momentum ' + m.momentumPercent + '%'); if (breakoutQueries.length) alertReasons.push(breakoutQueries.length + ' breakout related queries detected');
return { json: { ...job, momentum, breakoutQueries, alertRequired: alertReasons.length > 0, alertReasons, metricSummary: momentum.map((m) => m.keyword + '=' + m.momentumPercent + '%').join(', '), reportTitle: 'Google keyword trend report', productUrl: 'https://www.pangolinfo.com/ai-overview-serp-api/' } };`,
  },
  {
    slug: 'amazon-niche-opportunity-scorecard',
    name: 'Score Amazon Niche Opportunities with Pangolinfo Market Data',
    heading: 'Amazon niche opportunity scorecard',
    overview: 'Filter Amazon niches by demand and concentration, normalize the returned market metrics, calculate a transparent opportunity score, rank candidates, and alert when strong product-selection opportunities appear.',
    outcomes: ['Apply demand and brand-concentration filters', 'Score and rank niche opportunities transparently', 'Expose the metrics behind every recommendation', 'Produce a short product-research shortlist'],
    productUrl: 'https://www.pangolinfo.com/amazon-niche-data-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/nicheFilterAPI/nicheFilterAPI', subjectPrefix: 'Niche Opportunity',
    assignments: [
      { name: 'marketplaceId', value: 'US', type: 'string' }, { name: 'minimumSearchVolume', value: 10000, type: 'number' }, { name: 'maximumTop5BrandShare', value: 0.4, type: 'number' }, { name: 'resultSize', value: 20, type: 'number' }, { name: 'minimumOpportunityScore', value: 65, type: 'number' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json; if (Number(config.resultSize) < 1 || Number(config.resultSize) > 50) throw new Error('resultSize must be between 1 and 50.'); return [{ json: { ...config, monitorKey: config.marketplaceId } }];`,
    apiNodeName: 'Filter Amazon Niches', apiParameters: { resource: 'market', operation: 'filterNiches', marketplaceId: '={{ $json.marketplaceId }}', filterJson: '={{ JSON.stringify({ searchVolumeT90Min: $json.minimumSearchVolume, top5BrandsClickShareMax: $json.maximumTop5BrandShare, page: 1, size: $json.resultSize }) }}' },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json; const payload = $json.data ?? $json; const raw = payload.items?.data ?? payload.items ?? payload.data?.items ?? payload.data ?? payload.json ?? payload; const items = Array.isArray(raw) ? raw : [];
const scored = items.map((n) => { const volume = Number(n.searchVolumeT90 ?? n.searchVolume ?? 0); const concentration = Number(n.top5BrandsClickShare ?? n.top5BrandShare ?? 1); const growth = Number(n.searchVolumeT90Yoy ?? n.growth ?? 0); const demandScore = Math.min(45, Math.log10(Math.max(volume, 1)) * 10); const competitionScore = Math.max(0, 35 * (1 - concentration)); const growthScore = Math.max(0, Math.min(20, growth / 5)); const score = Math.round(demandScore + competitionScore + growthScore); return { ...n, opportunityScore: score, demandScore: Math.round(demandScore), competitionScore: Math.round(competitionScore), growthScore: Math.round(growthScore) }; }).sort((a, b) => b.opportunityScore - a.opportunityScore);
const strong = scored.filter((n) => n.opportunityScore >= Number(job.minimumOpportunityScore)); const alertReasons = strong.length ? [strong.length + ' niches exceed opportunity score ' + job.minimumOpportunityScore] : [];
return { json: { ...job, candidateCount: scored.length, strongOpportunityCount: strong.length, topOpportunities: scored.slice(0, 10), alertRequired: alertReasons.length > 0, alertReasons, metricSummary: 'candidates=' + scored.length + ', strong=' + strong.length + ', best=' + (scored[0]?.opportunityScore ?? 'n/a'), reportTitle: 'Amazon niche opportunity scorecard', productUrl: 'https://www.pangolinfo.com/amazon-niche-data-api/' } };`,
  },
  {
    slug: 'amazon-seller-catalog-monitor',
    name: 'Monitor Amazon Competitor Seller Catalogs with Pangolinfo',
    heading: 'Amazon competitor seller catalog monitor',
    overview: 'Track one or more Amazon seller IDs, retrieve their current product catalogs, summarize assortment size and pricing, identify discounted or unavailable items, and alert when catalog risk thresholds are crossed.',
    outcomes: ['Monitor multiple competitor seller IDs', 'Summarize assortment, price range, ratings, and discounting', 'Detect small catalogs or high unavailable-product share', 'Create a seller-level competitive intelligence report'],
    productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI', subjectPrefix: 'Seller Catalog',
    assignments: [
      { name: 'sellerIds', value: 'A2EXAMPLE01\nA2EXAMPLE02', type: 'string' }, { name: 'site', value: 'amz_us', type: 'string' }, { name: 'zipcode', value: '10041', type: 'string' }, { name: 'pageCount', value: 1, type: 'number' }, { name: 'minimumCatalogSize', value: 10, type: 'number' }, { name: 'maximumUnavailableShare', value: 0.2, type: 'number' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json; const sellerIds = String(config.sellerIds ?? '').split(/\r?\n|,/).map((v) => v.trim()).filter(Boolean); if (!sellerIds.length) throw new Error('Add at least one seller ID.'); if (sellerIds.length > 10) throw new Error('Use at most 10 sellers per run.'); return sellerIds.map((sellerId) => ({ json: { ...config, sellerId, monitorKey: sellerId } }));`,
    apiNodeName: 'List Seller Products', apiParameters: { resource: 'amazon', operation: 'sellerProducts', sellerId: '={{ $json.sellerId }}', site: '={{ $json.site }}', zipcode: '={{ $json.zipcode }}', pageCount: '={{ $json.pageCount }}' },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json; const payload = $json.data ?? $json; const raw = payload.json ?? payload.data?.json ?? payload; const products = [raw, raw?.items, raw?.products, raw?.results].find(Array.isArray) ?? [];
const prices = products.map((p) => Number(String(p.price ?? p.currentPrice ?? '').replace(/,/g, '').match(/\d+(?:\.\d+)?/)?.[0] ?? NaN)).filter(Number.isFinite); const unavailable = products.filter((p) => /unavailable|out of stock/.test(String(p.availability ?? p.stock ?? '').toLowerCase())); const discounted = products.filter((p) => p.coupon || p.discount || p.savingsPercentage); const unavailableShare = products.length ? unavailable.length / products.length : 0; const alertReasons = []; if (products.length < Number(job.minimumCatalogSize)) alertReasons.push('Catalog smaller than threshold: ' + products.length); if (unavailableShare > Number(job.maximumUnavailableShare)) alertReasons.push('Unavailable share is ' + Math.round(unavailableShare * 100) + '%');
return { json: { ...job, catalogSize: products.length, unavailableCount: unavailable.length, unavailableShare, discountedCount: discounted.length, minimumPrice: prices.length ? Math.min(...prices) : null, maximumPrice: prices.length ? Math.max(...prices) : null, sampleProducts: products.slice(0, 10), alertRequired: alertReasons.length > 0, alertReasons, metricSummary: 'products=' + products.length + ', unavailable=' + Math.round(unavailableShare * 100) + '%, discounted=' + discounted.length, reportTitle: 'Amazon seller catalog report', productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/' } };`,
  },
  {
    slug: 'amazon-alexa-share-of-voice-monitor',
    name: 'Monitor Amazon Alexa Shopping Share of Voice with Pangolinfo',
    heading: 'Amazon Alexa Shopping share-of-voice monitor',
    overview: 'Run up to five shopping prompts through Amazon Alexa, normalize recommended products, measure target-brand and target-ASIN presence, and alert when conversational commerce visibility falls below a threshold.',
    outcomes: ['Audit several product-discovery prompts in one request', 'Measure brand and ASIN recommendation coverage', 'Capture competing products and follow-up questions', 'Create an Alexa/AEO visibility report'],
    productUrl: 'https://www.pangolinfo.com/amazon-alexa-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/amazonAlexaAPI/amazonAlexaAPI', subjectPrefix: 'Alexa Share of Voice',
    assignments: [
      { name: 'prompts', value: 'Recommend a quiet portable fan under $30\nWhat is the best fan for travel?\nWhich rechargeable desk fan should I buy?', type: 'string' }, { name: 'trackedBrand', value: 'Example Brand', type: 'string' }, { name: 'trackedAsins', value: 'B0DYTF8L2W', type: 'string' }, { name: 'minimumPromptCoverage', value: 0.5, type: 'number' }, { name: 'contextUrl', value: 'https://www.amazon.com/', type: 'string' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json; const prompts = String(config.prompts ?? '').split(/\r?\n/).map((v) => v.trim()).filter(Boolean); if (!prompts.length || prompts.length > 5) throw new Error('Provide between one and five Alexa prompts.'); const trackedAsins = String(config.trackedAsins ?? '').split(/[\s,]+/).map((v) => v.trim().toUpperCase()).filter(Boolean); return [{ json: { ...config, prompts, trackedAsins, monitorKey: config.trackedBrand } }];`,
    apiNodeName: 'Ask Amazon Alexa', apiParameters: { resource: 'ai', operation: 'alexa', prompts: '={{ $json.prompts.join("\n") }}', contextUrl: '={{ $json.contextUrl }}', screenshot: false },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json; const payload = $json.data ?? $json; const turnsRaw = payload.json ?? payload.data?.json ?? payload; const turns = Array.isArray(turnsRaw) ? turnsRaw : [turnsRaw]; const brand = String(job.trackedBrand ?? '').toLowerCase();
const analyzed = turns.map((turn) => { const groups = Array.isArray(turn.products) ? turn.products : []; const products = groups.flatMap((g) => Array.isArray(g.items) ? g.items : Array.isArray(g.products) ? g.products : []); const brandPresent = products.some((p) => String(p.title ?? p.brand ?? '').toLowerCase().includes(brand)); const asinPresent = products.some((p) => job.trackedAsins.includes(String(p.asin ?? '').toUpperCase())); return { prompt: turn.prompt ?? null, answer: turn.content ?? null, recommendationCount: products.length, brandPresent, asinPresent, products: products.slice(0, 10), followUpQuestions: turn.follow_up_questions ?? [] }; });
const visibleTurns = analyzed.filter((t) => t.brandPresent || t.asinPresent).length; const promptCoverage = analyzed.length ? visibleTurns / analyzed.length : 0; const alertReasons = []; if (promptCoverage < Number(job.minimumPromptCoverage)) alertReasons.push('Prompt coverage below target: ' + Math.round(promptCoverage * 100) + '%'); if (!analyzed.length) alertReasons.push('No Alexa turns returned');
return { json: { ...job, promptCount: analyzed.length, visiblePromptCount: visibleTurns, promptCoverage, turns: analyzed, alertRequired: alertReasons.length > 0, alertReasons, metricSummary: 'coverage=' + Math.round(promptCoverage * 100) + '%, prompts=' + analyzed.length, reportTitle: 'Amazon Alexa share-of-voice report', productUrl: 'https://www.pangolinfo.com/amazon-alexa-api/' } };`,
  },
  {
    slug: 'amazon-best-seller-rank-monitor',
    name: 'Monitor Amazon Best Seller Rankings and Brand Share with Pangolinfo',
    heading: 'Amazon Best Sellers rank and brand-share monitor',
    overview: 'Retrieve current Amazon Best Sellers for several category keywords, measure target-brand and target-ASIN presence, record the best observed rank, and alert when category visibility drops.',
    outcomes: ['Monitor several Best Sellers categories in one run', 'Measure target-brand share of the returned shelf', 'Track the best rank for owned ASINs', 'Detect missing products and category visibility loss'],
    productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI', subjectPrefix: 'Best Seller Rank',
    assignments: [
      { name: 'categoryKeywords', value: 'portable fans\ndesk fans\nwearable fans', type: 'string' }, { name: 'trackedBrand', value: 'Example Brand', type: 'string' }, { name: 'trackedAsins', value: 'B0DYTF8L2W', type: 'string' }, { name: 'site', value: 'amz_us', type: 'string' }, { name: 'zipcode', value: '10041', type: 'string' }, { name: 'minimumBrandShare', value: 0.05, type: 'number' }, { name: 'maximumBestRank', value: 50, type: 'number' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json; const categoryKeywords = String(config.categoryKeywords ?? '').split(/\r?\n/).map((v) => v.trim()).filter(Boolean); if (!categoryKeywords.length) throw new Error('Add at least one Best Sellers category keyword.'); if (categoryKeywords.length > 15) throw new Error('Use at most 15 categories per run.'); const trackedAsins = String(config.trackedAsins ?? '').split(/[\s,]+/).map((v) => v.trim().toUpperCase()).filter(Boolean); return categoryKeywords.map((keyword) => ({ json: { ...config, keyword, trackedAsins, monitorKey: keyword } }));`,
    apiNodeName: 'Get Amazon Best Sellers', apiParameters: { resource: 'amazon', operation: 'bestSellers', keyword: '={{ $json.keyword }}', site: '={{ $json.site }}', zipcode: '={{ $json.zipcode }}' },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json; const payload = $json.data ?? $json; const raw = payload.json ?? payload.data?.json ?? payload; const products = [raw, raw?.items, raw?.products, raw?.results].find(Array.isArray) ?? []; const brand = String(job.trackedBrand ?? '').toLowerCase(); const normalized = products.map((p, i) => ({ asin: String(p.asin ?? p.productId ?? '').toUpperCase(), title: p.title ?? p.name ?? null, brand: p.brand ?? null, rank: Number(p.rank ?? p.position ?? i + 1), price: p.price ?? null, rating: p.rating ?? p.star ?? null })); const brandMatches = normalized.filter((p) => String(p.brand ?? p.title ?? '').toLowerCase().includes(brand)); const asinMatches = normalized.filter((p) => job.trackedAsins.includes(p.asin)); const brandShare = normalized.length ? brandMatches.length / normalized.length : 0; const bestTrackedRank = asinMatches.length ? Math.min(...asinMatches.map((p) => p.rank)) : null; const alertReasons = []; if (!normalized.length) alertReasons.push('No Best Sellers returned'); if (brandShare < Number(job.minimumBrandShare)) alertReasons.push('Brand share below threshold: ' + Math.round(brandShare * 100) + '%'); if (job.trackedAsins.length && bestTrackedRank === null) alertReasons.push('Tracked ASINs missing from Best Sellers'); else if (bestTrackedRank > Number(job.maximumBestRank)) alertReasons.push('Best tracked rank below target: ' + bestTrackedRank); return { json: { ...job, productCount: normalized.length, brandMatchCount: brandMatches.length, brandShare, bestTrackedRank, matchedProducts: [...brandMatches, ...asinMatches].slice(0, 10), topProducts: normalized.slice(0, 10), alertRequired: alertReasons.length > 0, alertReasons, metricSummary: 'brand share=' + Math.round(brandShare * 100) + '%, best rank=' + (bestTrackedRank ?? 'not found'), reportTitle: 'Amazon Best Sellers visibility report', productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/' } };`,
  },
  {
    slug: 'amazon-new-release-launch-radar',
    name: 'Build an Amazon New Release Product Launch Radar with Pangolinfo',
    heading: 'Amazon New Releases product-launch radar',
    overview: 'Scan several Amazon New Releases categories, normalize newly visible products, score launch traction from rank, rating, reviews, price, and discount signals, and produce a shortlist for competitive or product research.',
    outcomes: ['Scan multiple New Releases categories', 'Normalize launch rank, rating, reviews, price, and discount signals', 'Calculate a transparent launch-traction score', 'Alert when high-traction new competitors appear'],
    productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/', docsUrl: 'https://docs.pangolinfo.com/en-api-reference/amazonApi/amazonScrapeAPI', subjectPrefix: 'New Release Radar',
    assignments: [
      { name: 'categoryKeywords', value: 'portable fans\ndesk fans\nwearable fans', type: 'string' }, { name: 'site', value: 'amz_us', type: 'string' }, { name: 'zipcode', value: '10041', type: 'string' }, { name: 'minimumLaunchScore', value: 60, type: 'number' }, { name: 'maximumProductsPerCategory', value: 30, type: 'number' }, ...emailAssignments,
    ],
    prepareCode: String.raw`const config = $json; const categoryKeywords = String(config.categoryKeywords ?? '').split(/\r?\n/).map((v) => v.trim()).filter(Boolean); if (!categoryKeywords.length) throw new Error('Add at least one New Releases category keyword.'); if (categoryKeywords.length > 15) throw new Error('Use at most 15 categories per run.'); return categoryKeywords.map((keyword) => ({ json: { ...config, keyword, monitorKey: keyword } }));`,
    apiNodeName: 'Get Amazon New Releases', apiParameters: { resource: 'amazon', operation: 'newReleases', keyword: '={{ $json.keyword }}', site: '={{ $json.site }}', zipcode: '={{ $json.zipcode }}' },
    analyzeCode: String.raw`const job = $('Prepare Monitoring Jobs').item.json; const payload = $json.data ?? $json; const raw = payload.json ?? payload.data?.json ?? payload; const products = ([raw, raw?.items, raw?.products, raw?.results].find(Array.isArray) ?? []).slice(0, Number(job.maximumProductsPerCategory)); const num = (value) => Number(String(value ?? '').replace(/,/g, '').match(/\d+(?:\.\d+)?/)?.[0] ?? 0); const scored = products.map((p, i) => { const rank = num(p.rank ?? p.position ?? i + 1) || i + 1; const rating = num(p.rating ?? p.star); const reviews = num(p.ratingsCount ?? p.reviewCount); const hasDiscount = Boolean(p.coupon || p.discount || p.savingsPercentage); const rankScore = Math.max(0, 45 - Math.min(45, rank - 1)); const ratingScore = Math.min(25, rating * 5); const reviewScore = Math.min(20, Math.log10(Math.max(reviews, 1)) * 8); const discountScore = hasDiscount ? 10 : 0; return { asin: p.asin ?? p.productId ?? null, title: p.title ?? p.name ?? null, rank, rating, reviews, price: p.price ?? null, hasDiscount, launchScore: Math.round(rankScore + ratingScore + reviewScore + discountScore) }; }).sort((a, b) => b.launchScore - a.launchScore); const strong = scored.filter((p) => p.launchScore >= Number(job.minimumLaunchScore)); const alertReasons = strong.length ? [strong.length + ' high-traction new releases detected'] : []; return { json: { ...job, productCount: scored.length, strongLaunchCount: strong.length, topLaunches: scored.slice(0, 10), strongLaunches: strong.slice(0, 10), alertRequired: alertReasons.length > 0, alertReasons, metricSummary: 'products=' + scored.length + ', strong launches=' + strong.length + ', best score=' + (scored[0]?.launchScore ?? 'n/a'), reportTitle: 'Amazon New Releases launch radar', productUrl: 'https://www.pangolinfo.com/amazon-scraper-api/' } };`,
  },
];

for (const spec of specs) {
  const workflow = standardWorkflow(spec);
  fs.writeFileSync(path.join(outDir, `${spec.slug}.json`), `${JSON.stringify(workflow, null, 2)}\n`);
  const submission = `# ${spec.name}\n\n${spec.overview}\n\n## Who is this for?\n\nAmazon sellers, ecommerce operators, product researchers, SEO/GEO teams, analysts, and automation developers who need current structured data and an actionable report rather than a raw API response.\n\n## What this workflow does\n\n${spec.outcomes.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\n## Setup\n\n1. Use self-hosted n8n with community nodes enabled.\n2. Install \`n8n-nodes-pangolinfo\`.\n3. Create a Pangolinfo API credential and select it on the Pangolinfo node.\n4. Edit only **Monitoring Configuration**, then run the manual trigger.\n5. Connect SMTP or replace the email node with your preferred alert destination.\n6. Activate the schedule only after a successful test.\n\n## Requirements and links\n\n- Product: ${spec.productUrl}\n- API documentation: ${spec.docsUrl}\n- Pangolinfo Console: https://tool.pangolinfo.com/\n- Community node source: https://github.com/Pangolin-spg/n8n-nodes-pangolinfo\n\nThe template is inactive by default, contains no API key, bounds batch size to control credit usage, and surfaces human-readable validation errors.\n`;
  fs.writeFileSync(path.join(outDir, `${spec.slug}-submission.md`), submission);
}

console.log(`Generated ${specs.length} advanced Pangolinfo workflow templates.`);
