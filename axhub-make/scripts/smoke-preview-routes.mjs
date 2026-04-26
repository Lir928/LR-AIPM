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
const targetArgs = hasBaseUrlArg ? process.argv.slice(3) : process.argv.slice(2);
const targets = targetArgs.length > 0
  ? targetArgs
  : [
      '/prototypes/ref-antd-copy',
      '/components/ref-button',
      '/themes/antd-new',
    ];

let hasFailure = false;

for (const target of targets) {
  const requestUrl = new URL(target, baseUrl).toString();

  try {
    const response = await fetch(requestUrl, {
      redirect: 'follow',
      headers: {
        Accept: 'text/html',
      },
    });

    const html = await response.text();
    const htmlProxyMatches = Array.from(
      html.matchAll(/src="([^"]*html-proxy[^"]*)"/g),
      (match) => match[1],
    );
    const bootstrapProxy = htmlProxyMatches.find((value) => value.includes('index=0.js')) || null;
    const hostProxy = htmlProxyMatches.find((value) => value.includes('index=1.js')) || null;

    let bootstrapScript = '';
    let hostScript = '';
    if (bootstrapProxy) {
      bootstrapScript = await fetch(new URL(bootstrapProxy, baseUrl)).then((res) => res.text());
    }
    if (hostProxy) {
      hostScript = await fetch(new URL(hostProxy, baseUrl)).then((res) => res.text());
    }

    const ok = response.ok
      && html.includes('<div id="root"></div>')
      && htmlProxyMatches.length >= 2
      && !html.includes('waitForBootstrap')
      && bootstrapScript.includes('dev-template-bootstrap.js')
      && hostScript.includes('import PreviewComponent from')
      && hostScript.includes('import.meta.hot.accept(')
      && hostScript.includes(`window.AxhubDevComponent = CurrentComponent;`)
      && html.includes('<div id="root"></div>');

    if (!ok) {
      hasFailure = true;
      console.error(`[preview-smoke] FAIL ${requestUrl}`);
      console.error(`  status=${response.status}`);
      console.error(`  containsRoot=${html.includes('<div id="root"></div>')}`);
      console.error(`  htmlProxyCount=${htmlProxyMatches.length}`);
      console.error(`  removedLegacyLoader=${!html.includes('waitForBootstrap')}`);
      console.error(`  bootstrapProxy=${Boolean(bootstrapProxy)}`);
      console.error(`  hostProxy=${Boolean(hostProxy)}`);
      console.error(`  hostImportsEntry=${hostScript.includes('import PreviewComponent from')}`);
      console.error(`  hostHasAcceptBoundary=${hostScript.includes('import.meta.hot.accept(')}`);
      console.error(`  hostSetsDebugGlobals=${hostScript.includes('window.AxhubDevComponent = CurrentComponent;')}`);
      continue;
    }

    console.log(`[preview-smoke] OK   ${requestUrl}`);
  } catch (error) {
    hasFailure = true;
    console.error(`[preview-smoke] ERROR ${requestUrl}`);
    console.error(`  ${(error && error.message) || error}`);
  }
}

if (hasFailure) {
  process.exitCode = 1;
}
