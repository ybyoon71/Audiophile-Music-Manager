const fs = require('fs');
const https = require('https');
https.get('https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.includes('createRoot'));
  });
});
