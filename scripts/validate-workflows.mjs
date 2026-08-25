import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const templatesDirectory = path.resolve('workflow-templates');
const files = fs
  .readdirSync(templatesDirectory)
  .filter((file) => file.endsWith('.json'))
  .sort();

if (files.length === 0) {
  throw new Error('No workflow templates found.');
}

for (const file of files) {
  const absolutePath = path.join(templatesDirectory, file);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const workflow = JSON.parse(source);
  const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
  const names = new Set(nodes.map((node) => node.name));
  const ids = new Set(nodes.map((node) => node.id));

  if (!workflow.name || nodes.length < 3) {
    throw new Error(`${file}: missing workflow name or useful node graph.`);
  }
  if (names.size !== nodes.length || ids.size !== nodes.length) {
    throw new Error(`${file}: duplicate node name or ID.`);
  }
  if (workflow.active !== false) {
    throw new Error(`${file}: published templates must be inactive.`);
  }
  const stickyCount = nodes.filter(
    (node) => node.type === 'n8n-nodes-base.stickyNote',
  ).length;
  if (file === 'ai-overview-monitor.json' && stickyCount < 4) {
    throw new Error(`${file}: the advanced monitoring workflow requires four section notes.`);
  }
  if (source.includes('Email Monitoring Alert')) {
    const executionNodeCount = nodes.length - stickyCount;
    if (stickyCount < 4 || executionNodeCount < 10) {
      throw new Error(`${file}: growth workflows require four notes and ten execution nodes.`);
    }
    if (!source.includes('pangolinfo.com/') || !source.includes('docs.pangolinfo.com/')) {
      throw new Error(`${file}: missing product or API documentation link.`);
    }
  }

  for (const [sourceNode, outputs] of Object.entries(workflow.connections ?? {})) {
    if (!names.has(sourceNode)) {
      throw new Error(`${file}: connection source does not exist: ${sourceNode}`);
    }
    for (const output of outputs.main ?? []) {
      for (const connection of output) {
        if (!names.has(connection.node)) {
          throw new Error(`${file}: connection target does not exist: ${connection.node}`);
        }
      }
    }
  }

  for (const node of nodes.filter((item) => item.type === 'n8n-nodes-base.code')) {
    try {
      new Function(node.parameters.jsCode);
    } catch (error) {
      throw new Error(`${file}: invalid JavaScript in ${node.name}: ${error.message}`);
    }
  }

  if (/eyJhbGciOi|BEGIN (?:RSA |EC )?PRIVATE KEY|gh[opusr]_[A-Za-z0-9_]{20,}/.test(source)) {
    throw new Error(`${file}: possible credential or private key detected.`);
  }
}

console.log(`Validated ${files.length} workflow templates.`);
process.exit(0);
