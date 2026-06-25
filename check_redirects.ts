import fs from 'fs';

const data = JSON.parse(fs.readFileSync('C:\\Users\\vikur\\.gemini\\antigravity\\brain\\7d4a8c7b-9f8a-4819-9bbd-c6166bf5b5ca\\.system_generated\\steps\\363\\content.md', 'utf-8').split('---')[1].trim());

const badRedirects = data.redirects.filter(r => r.source === '/web-development');
console.log('Redirects FROM /web-development:', badRedirects);
