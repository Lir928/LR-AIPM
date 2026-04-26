#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveBaseUrlFromDevInfo() {
  try {
    const devInfoPath = path.resolve(__dirname, '../.axhub/make/.dev-server-info.json');
    if (!fs.existsSync(devInfoPath)) return 'http://localhost:5173';
    const info = JSON.parse(fs.readFileSync(devInfoPath, 'utf8'));
    const host = info && info.host ? info.host : 'localhost';
    const port = info && info.port ? Number(info.port) : 0;
    if (!port) return 'http://localhost:5173';
    return 'http://' + host + ':' + String(port);
  } catch (e) {
    return 'http://localhost:5173';
  }
}

const arg2 = process.argv[2] || '';
const hasBaseUrlArg = arg2.startsWith('http://') || arg2.startsWith('https://');
const baseUrl = hasBaseUrlArg ? arg2 : resolveBaseUrlFromDevInfo();
const rootUrl = new URL('/', baseUrl).toString();
const previewUrl = new URL('/prototypes/ref-antd-copy', baseUrl).toString();

let hasFailure = false;

async function checkHtml(url, expected) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { Accept: 'text/html' },
  });
  const html = await response.text();

  const result = {
    ok: response.ok,
    hasViteClient: html.includes('/@vite/client'),
    hasReactRefreshPreamble: html.includes('/@react-refresh'),
  };

  const matches = expected(result);
  if (!matches) {
    hasFailure = true;
    console.error(`[shell-boundary] FAIL ${url}`);
    console.error(`  status=${response.status}`);
    console.error(`  hasViteClient=${result.hasViteClient}`);
    console.error(`  hasReactRefreshPreamble=${result.hasReactRefreshPreamble}`);
    return;
  }

  console.log(`[shell-boundary] OK   ${url}`);
}

await checkHtml(rootUrl, (result) => (
  result.ok
  && !result.hasViteClient
  && !result.hasReactRefreshPreamble
));

await checkHtml(previewUrl, (result) => (
  result.ok
  && result.hasViteClient
  && result.hasReactRefreshPreamble
));

if (hasFailure) {
  process.exitCode = 1;
}
