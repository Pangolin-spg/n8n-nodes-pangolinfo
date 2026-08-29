import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const workflow = JSON.parse(
  fs.readFileSync(path.resolve('workflow-templates/amazon-keyword-ad-rank-monitor.json'), 'utf8'),
);
const node = (name) => workflow.nodes.find((item) => item.name === name);
const run = (name, context) => {
  const source = node(name)?.parameters?.jsCode;
  assert.ok(source, `Missing code node: ${name}`);
  return new Function('$json', '$input', '$getWorkflowStaticData', '$', source)(
    context.$json,
    context.$input,
    context.$getWorkflowStaticData,
    context.$,
  );
};

const config = {
  keywords: 'noise cancelling headphones',
  trackedAsins: 'B0DYTF8L2W',
  competitorAsins: 'B0CEXAMPL1',
  site: 'amz_us',
  zipcode: '10041',
  maxOrganicRank: 20,
  maxSponsoredRank: 10,
  organicDropThreshold: 5,
  sponsoredDropThreshold: 3,
  requireSponsoredPresence: true,
  alertCooldownHours: 24,
  sendHealthyDailyDigest: false,
  alertFromEmail: 'alerts@example.com',
  alertToEmail: 'team@example.com',
};

const jobs = run('Validate and Expand Watchlist', { $json: config });
assert.equal(jobs.length, 1);
const job = jobs[0].json;
const workflowNode = () => ({ item: { json: job } });

const normalize = (products) => run('Normalize Target and Competitor Visibility', {
  $json: { data: { items: products } },
  $: workflowNode,
});

const state = {};
const compare = (current) => run('Compare History and Classify Events', {
  $input: { all: () => [{ json: current.json }] },
  $getWorkflowStaticData: () => state,
});

const baselineCurrent = normalize([
  { asin: 'B0CEXAMPL1', position: 1, sponsored: false },
  { asin: 'B0DYTF8L2W', position: 5, sponsored: false },
  { asin: 'B0DYTF8L2W', position: 2, sponsored: true },
]);
const baseline = compare(baselineCurrent);
assert.equal(baseline[0].json.hasBaseline, false);
assert.equal(baseline[0].json.notificationDue, false);
assert.equal(baseline[0].json.severity, 'healthy');

const droppedCurrent = normalize([
  { asin: 'B0CEXAMPL1', position: 1, sponsored: false },
  { asin: 'B0DYTF8L2W', position: 15, sponsored: false },
]);
const dropped = compare(droppedCurrent);
assert.equal(dropped[0].json.hasBaseline, true);
assert.equal(dropped[0].json.organicDrop, 10);
assert.equal(dropped[0].json.notificationDue, true);
assert.ok(dropped[0].json.events.includes('organic_drop'));
assert.ok(dropped[0].json.events.includes('sponsored_lost'));

const report = run('Build Portfolio Intelligence Report', {
  $input: { all: () => dropped },
});
assert.equal(report[0].json.alertRequired, true);
assert.equal(report[0].json.alertCount, 1);
assert.match(report[0].json.reportMarkdown, /Amazon organic and Sponsored rank intelligence/);

run('Acknowledge Successful Alerts', {
  $getWorkflowStaticData: () => state,
  $: (name) => {
    assert.equal(name, 'Build Portfolio Intelligence Report');
    return { first: () => ({ json: report[0].json }) };
  },
});

const repeated = compare(droppedCurrent);
assert.equal(repeated[0].json.notificationDue, false);

const recoveredCurrent = normalize([
  { asin: 'B0DYTF8L2W', position: 4, sponsored: false },
  { asin: 'B0DYTF8L2W', position: 1, sponsored: true },
]);
const recovered = compare(recoveredCurrent);
assert.equal(recovered[0].json.recovered, true);
assert.equal(recovered[0].json.severity, 'recovered');

console.log('Amazon keyword monitor regression scenarios passed.');
