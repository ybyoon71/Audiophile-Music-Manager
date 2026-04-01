const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  fs.writeFileSync('script.jsx', scriptMatch[1]);
  console.log('Extracted script.jsx');
} else {
  console.log('No script found');
}
