const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<meta property="og:description" content="19 [^\w\s]+ femboy [^\w\s]+ godot dev [^\w\s]+ roblox executor [^\w\s]+ suburban explorer" \/>/g, '<meta property="og:description" content="19 • femboy • godot dev • roblox executor • suburban explorer" />');

html = html.replace(/<!-- [^\w\s]+ LANDING [^\w\s]+ -->/g, '<!-- ── LANDING ── -->');
html = html.replace(/<!-- [^\w\s]+ MAIN [^\w\s]+ -->/g, '<!-- ── MAIN ── -->');
html = html.replace(/<!-- [^\w\s]+ CURSOR MENU [^\w\s]+ -->/g, '<!-- ── CURSOR MENU ── -->');
html = html.replace(/<!-- [^\w\s]+ HERO [^\w\s]+ -->/g, '<!-- ── HERO ── -->');
html = html.replace(/<!-- [^\w\s]+ ABOUT [^\w\s]+ -->/g, '<!-- ── ABOUT ── -->');
html = html.replace(/<!-- [^\w\s]+ EXPERIENCE [^\w\s]+ -->/g, '<!-- ── EXPERIENCE ── -->');
html = html.replace(/<!-- [^\w\s]+ LINKS [^\w\s]+ -->/g, '<!-- ── LINKS ── -->');
html = html.replace(/<!-- [^\w\s]+ MUSIC PLAYER [^\w\s]+ -->/g, '<!-- ── MUSIC PLAYER ── -->');

html = html.replace(/<span id="viewTxt">[^\w\s]+ VIEWS<\/span>/g, '<span id="viewTxt">... VIEWS</span>');
html = html.replace(/<div class="hero-time" id="timeTxt">TIME [^\w\s]+ --:--:-- --<\/div>/g, '<div class="hero-time" id="timeTxt">TIME • --:--:-- --</div>');

html = html.replace(/<strong>Unity<\/strong> too [^\w\s]+/g, '<strong>Unity</strong> too —');
html = html.replace(/None are perfect [^\w\s]+ I'm still learning [^\w\s]+ but it's/g, 'None are perfect — I\'m still learning — but it\'s');
html = html.replace(/Most importantly [^\w\s]+ I have a partner [^\w\s]+ <strong>/g, 'Most importantly — I have a partner — <strong>');

html = html.replace(/<div class="exp-date">2023 [^\w\s]+ 2026<\/div>/g, '<div class="exp-date">2023 • 2026</div>');

html = html.replace(/<button id="mp-prev">[^\w\s]+<\/button>/g, '<button id="mp-prev">⏮</button>');
html = html.replace(/<button id="mp-play">[^\w\s]+<\/button>/g, '<button id="mp-play">▶</button>');
html = html.replace(/<button id="mp-next">[^\w\s]+<\/button>/g, '<button id="mp-next">⏭</button>');

html = html.replace(/^[^\w\s<]+/g, '');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed');
