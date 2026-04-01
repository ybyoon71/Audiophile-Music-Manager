const fs = require('fs');

const appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// Extract MUSIC_DATA
const musicDataMatch = appTsx.match(/const MUSIC_DATA: Song\[\] = (\[[\s\S]*?\]);\n\nexport default/);
const musicData = musicDataMatch ? musicDataMatch[1] : '[]';

// Extract App component body
const appMatch = appTsx.match(/export default function App\(\) \{([\s\S]*)\}/);
let appBody = appMatch ? appMatch[1] : '';

// Replace Lucide icons
const icons = ['Search', 'Play', 'Disc3', 'Speaker', 'Music', 'Mic2', 'Headphones', 'Trash2', 'Plus', 'Loader2', 'X'];
icons.forEach(icon => {
  appBody = appBody.replace(new RegExp(`<${icon} `, 'g'), `<Icons.${icon} `);
  appBody = appBody.replace(new RegExp(`<${icon}/>`, 'g'), `<Icons.${icon}/>`);
  appBody = appBody.replace(new RegExp(`</${icon}>`, 'g'), `</Icons.${icon}>`);
});

// Replace GoogleGenAI with fetch
const fetchCode = `
      const apiKey = prompt("Please enter your Gemini API Key to use this feature:");
      if (!apiKey) {
        setIsGenerating(false);
        return;
      }
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Generate an audiophile system review for the song/music: "' + newSongQuery + '".\\n' +
        'The review MUST focus on how this specific track demonstrates the capabilities of this exact high-end audio system:\\n' +
        '- Preamp: MBL 6010D\\n' +
        '- Power Amp: Mark Levinson No.336L\\n' +
        '- Speakers: Acapella Violon 2001 (features an ion tweeter and horn midrange)\\n\\n' +
        'Return the result in JSON format matching the schema.'
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                artist: { type: "STRING" },
                category: { type: "STRING", description: "Must be exactly 'Classic', 'Pop', or 'Vocal'" },
                subCategory: { type: "STRING" },
                review: { type: "STRING", description: "Korean language. Professional audiophile review focusing on the specified system." },
                listeningPoint: { type: "STRING", description: "Korean language. Specific sonic elements to listen for." },
                youtubeId: { type: "STRING", description: "11-character YouTube video ID, or a good search keyword" }
              },
              required: ["title", "artist", "category", "subCategory", "review", "listeningPoint", "youtubeId"]
            }
          }
        })
      });
      
      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const parsedData = JSON.parse(data.candidates[0].content.parts[0].text);
        if (!['Classic', 'Pop', 'Vocal'].includes(parsedData.category)) {
          parsedData.category = 'Pop';
        }
        setGeneratedSong({
          ...parsedData,
          isSystemReference: true,
          id: Date.now()
        });
      }
`;

const tryBlockRegex = /try \{[\s\S]*?\} catch \(error\) \{/m;
appBody = appBody.replace(tryBlockRegex, `try {\n${fetchCode}\n    } catch (error) {`);
appBody = appBody.replace(/as Category/g, ''); // remove TS cast
appBody = appBody.replace(/as Song/g, ''); // remove TS cast
appBody = appBody.replace(/\(youtubeId: string, title: string, artist: string\)/g, '(youtubeId, title, artist)');
appBody = appBody.replace(/\(id: number\)/g, '(id)');
appBody = appBody.replace(/<Song\[\]>/g, '');
appBody = appBody.replace(/<Category>/g, '');
appBody = appBody.replace(/<Partial<Song> \| null>/g, '');
appBody = appBody.replace(/<Category\[\]>/g, '');
appBody = appBody.replace(/as Category/g, '');
appBody = appBody.replace(/as Song/g, '');

const htmlTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audiophile Music Manager</title>
  <script src="https://unpkg.com/@tailwindcss/browser@4" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js" crossorigin="anonymous"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
    body {
      font-family: 'Montserrat', sans-serif;
      background-color: #0a0a0a;
      color: #f5f2ed;
    }
    .font-serif {
      font-family: 'Cormorant Garamond', serif;
    }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #0a0a0a; }
    ::-webkit-scrollbar-thumb { background: rgba(245, 242, 237, 0.2); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(245, 242, 237, 0.4); }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useMemo } = React;

    const Icons = {
      Search: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
      Play: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
      Disc3: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="M6 12c0-1.7.7-3.2 1.8-4.2"></path><circle cx="12" cy="12" r="2"></circle><path d="M18 12c0 1.7-.7 3.2-1.8 4.2"></path></svg>,
      Speaker: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>,
      Music: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
      Mic2: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path><circle cx="17" cy="7" r="5"></circle></svg>,
      Headphones: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>,
      Trash2: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
      Plus: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
      Loader2: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>,
      X: ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    };

    const MUSIC_DATA = REPLACE_MUSIC_DATA;

    function App() {
      REPLACE_APP_BODY
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;

const finalHtml = htmlTemplate
  .replace('REPLACE_MUSIC_DATA', musicData)
  .replace('REPLACE_APP_BODY', appBody);

fs.writeFileSync('audiophile.html', finalHtml);
console.log('Done');
