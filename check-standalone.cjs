const Babel = require('@babel/standalone');
const fs = require('fs');
const code = fs.readFileSync('script.jsx', 'utf8');
try {
  Babel.transform(code, { presets: ['react'] });
  console.log('Success');
} catch (e) {
  console.error(e);
}
