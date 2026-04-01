const { JSDOM } = require('jsdom');
const Babel = require('@babel/standalone');
const fs = require('fs');

const code = fs.readFileSync('script.jsx', 'utf8');
const compiled = Babel.transform(code, { presets: ['react'] }).code;

const dom = new JSDOM(`<!DOCTYPE html><div id="root"></div>`, {
  runScripts: "dangerously",
  resources: "usable"
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

dom.window.React = require('react');
dom.window.ReactDOM = require('react-dom/client');

const script = dom.window.document.createElement('script');
script.textContent = `
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  ${compiled}
`;
dom.window.document.body.appendChild(script);

dom.window.addEventListener('error', (event) => {
  console.error('JSDOM Error:', event.error);
});

setTimeout(() => {
  console.log('Done');
}, 1000);
