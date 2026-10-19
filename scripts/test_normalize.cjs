const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../docs/showcase/index.html');
let rawContent = fs.readFileSync(targetPath, 'utf8');

// Check line endings
const isCRLF = rawContent.includes('\r\n');
console.log('File uses CRLF:', isCRLF);

let content = rawContent.replace(/\r\n/g, '\n');

// 1. Check oldCSS
const oldCSS = `.local-colony-layout {
    display: grid;
    grid-template-columns: 500px 1fr;
    gap: 18px;
    margin-top: 10px;
}`;

console.log('Includes oldCSS layout snippet:', content.includes('grid-template-columns: 500px 1fr;'));
console.log('Includes oldControlsRow snippet:', content.includes('MAP SCALE:'));
console.log('Includes oldSectorIntel snippet:', content.includes('<!-- Right: Tactical Embarkation HUD & Colonist Manifest -->'));
console.log('Includes COLONY_ROOM_DEFS snippet:', content.includes('const COLONY_ROOM_DEFS = ['));
