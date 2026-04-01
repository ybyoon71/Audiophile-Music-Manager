const babel = require('@babel/core');
const fs = require('fs');
const code = fs.readFileSync('script.jsx', 'utf8');
try {
  babel.transformSync(code, {
    presets: ['@babel/preset-react'],
    filename: 'script.jsx'
  });
  console.log('Success');
} catch (e) {
  console.error(e);
}
