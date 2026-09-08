#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const createRBTree = require("functional-red-black-tree");
const table = require("../dist/table.js").default;

let tree = createRBTree();
for (const line of table.split("\n")) {
  if (!line) continue;
  const [callNumber, ...entries] = line.split(",");
  const n = Number(callNumber);
  for (const entry of entries) {
    if (entry) tree = tree.insert(entry, n);
  }
}

const keys = [];
const vals = [];
tree.forEach((k, v) => {
  keys.push(k);
  vals.push(v);
});

const out = `/* Generated from dist/table.js. Regenerar: node scripts/export-pha-data.cjs */
export const KEYS = ${JSON.stringify(keys)};
export const VALS = ${JSON.stringify(vals)};
`;

fs.writeFileSync(path.join(__dirname, "../docs/pha-data.js"), out);
console.log(`Wrote docs/pha-data.js (${keys.length} entries)`);
