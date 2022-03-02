#!/usr/bin/env node

const { build } = require('esbuild')
const define = {}

for (const k in process.env) {
    if (k.startsWith('REACT_APP_')) {
      define[`process.env.${k}`] = JSON.stringify(process.env[k]);
    }
  }

const options = {
  entryPoints: ['app/javascript/application.js'],
  outdir: 'app/assets/builds',
  bundle: true,
  sourcemap: true,
  define,
}

build(options).catch(() => process.exit(1))