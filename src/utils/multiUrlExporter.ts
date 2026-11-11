import { MultiUrlData, MultiUrlItem } from '../types';

/**
 * Standard visual symbol set for links matching the design archetype
 */
export const POPULAR_LINK_SYMBOLS = [
  '⌁', // Compress / Lightning
  '▦', // QR / Grid
  '◐', // Colour / Contrast
  '✦', // Sparkle / Brand Star
  '⌘', // Code / GitHub / Command
  '◎', // Social / Instagram / Lens
  '𝕏', // X / Twitter
  'in', // LinkedIn
  '▶', // YouTube / Video
  '✉', // Email
  '💬', // WhatsApp / Chat
  '🛒', // Store / Merchandise
  '⚡', // Action / Fast
  '★', // Star / Highlight
  '🌐', // Web / Global
  '🔗', // Link
];

/**
 * Slugifies a title for clean download filenames
 */
function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'links-hub'
  );
}

/**
 * Automatically chooses a stylish symbol based on url context
 */
export function getAutoIconForUrl(url: string): string {
  const u = (url || '').toLowerCase();
  if (u.includes('compress') || u.includes('image')) return '⌁';
  if (u.includes('qr') || u.includes('barcode')) return '▦';
  if (u.includes('colour') || u.includes('color') || u.includes('palette')) return '◐';
  if (u.includes('github') || u.includes('gitlab') || u.includes('code')) return '⌘';
  if (u.includes('instagram') || u.includes('insta')) return '◎';
  if (u.includes('twitter') || u.includes('x.com')) return '𝕏';
  if (u.includes('linkedin')) return 'in';
  if (u.includes('youtube') || u.includes('youtu.be') || u.includes('video')) return '▶';
  if (u.includes('wa.me') || u.includes('whatsapp')) return '💬';
  if (u.includes('mailto:') || u.includes('mail') || u.includes('@')) return '✉';
  if (u.includes('shop') || u.includes('store') || u.includes('buy')) return '🛒';
  if (u.includes('odoo') || u.includes('portfolio') || u.includes('about')) return '✦';
  return '✦';
}

/**
 * Formats MultiUrlData into a clean, structured UTF-8 Plain Text document (.txt)
 */
export function formatMultiUrlAsTxt(data: MultiUrlData): string {
  const heroHeading = (data.heroHeading || data.title || '').trim();
  const handle = data.handle?.trim() || '';
  const desc = data.description?.trim() || '';
  const tags = (data.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const validLinks = (data.links || []).filter((l) => l.url && l.url.trim());
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const divider = '='.repeat(64);
  const subDivider = '-'.repeat(64);

  const lines: string[] = [
    divider,
    `LINK HUB & SHOWCASE`,
    divider,
  ];

  if (heroHeading) {
    lines.push(`Hero Heading: ${heroHeading}`);
  }
  if (handle) {
    lines.push(`Handle:       ${handle}`);
  }
  if (desc) {
    lines.push(`Bio:          ${desc}`);
  }
  if (tags.length > 0) {
    lines.push(`Tags:         ${tags.join(' • ')}`);
  }
  lines.push(`Total Links:  ${validLinks.length}`);
  lines.push(`Generated:    ${now}`);
  lines.push(subDivider);
  lines.push('');

  if (validLinks.length === 0) {
    lines.push('  [No links configured yet]');
  } else {
    validLinks.forEach((link, idx) => {
      let fullUrl = link.url.trim();
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }
      if (link.sectionHeader?.trim()) {
        lines.push(`--- ${link.sectionHeader.trim()} ---`);
      }
      const icon = link.icon || getAutoIconForUrl(fullUrl);
      const featuredBadge = link.isFeatured ? ' [FEATURED ★]' : '';
      const label = link.title.trim() || `Link #${idx + 1}`;
      lines.push(`[${idx + 1}] ${icon} ${label}${featuredBadge}`);
      lines.push(`    URL:  ${fullUrl}`);
      if (link.description?.trim()) {
        lines.push(`    Note: ${link.description.trim()}`);
      }
      lines.push('');
    });
  }

  lines.push(subDivider);
  lines.push(`Generated with QR Code Generator`);
  lines.push(divider);

  return lines.join('\r\n');
}

/**
 * Triggers browser download of Plain Text (.txt)
 */
export function downloadMultiUrlAsTxt(data: MultiUrlData) {
  const content = formatMultiUrlAsTxt(data);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const filename = `${slugify(data.heroHeading || data.title || 'links')}-hub.txt`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an inspired, high-craft HTML landing page matching the specified aesthetic
 */
export function generateMultiUrlHtml(data: MultiUrlData, qrCodeDataUrl?: string): string {
  const heroHeading = (data.heroHeading || data.title || '').trim() || 'Link Hub';
  const handle = (data.handle || '').trim();
  const bio = (data.description || '').trim();
  const avatarLetter = (
    data.avatarLetter ||
    (heroHeading && heroHeading !== 'Link Hub' ? heroHeading.charAt(0).toUpperCase() : '✦')
  ).trim();
  const avatarImage = data.avatarImage?.trim();
  const rawTags = data.tags || '';
  const tagsList = rawTags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const validLinks: MultiUrlItem[] = (data.links || []).filter((l) => l.url && l.url.trim());

  const renderedLinks = validLinks
    .map((link, idx) => {
      let fullUrl = link.url.trim();
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }
      const label = link.title.trim() || `Link #${idx + 1}`;
      const sub = link.description?.trim() || '';
      const icon = link.icon || getAutoIconForUrl(fullUrl);
      const isFeatured = Boolean(link.isFeatured);
      const sectionHeaderHtml = link.sectionHeader?.trim()
        ? `<div class="section-label">${escapeHtml(link.sectionHeader.trim())}</div>`
        : '';

      return `
    ${sectionHeaderHtml}
    <a class="link ${isFeatured ? 'featured' : ''}" href="${escapeHtml(fullUrl)}" target="_blank" rel="noopener noreferrer" id="link-item-${idx + 1}">
      <div class="icon">${escapeHtml(icon)}</div>
      <div class="link-main">
        <div class="link-title">${escapeHtml(label)}</div>
        ${sub ? `<div class="link-sub">${escapeHtml(sub)}</div>` : ''}
      </div>
      <div class="arrow">›</div>
    </a>`;
    })
    .join('\n');

  // Detect or fallback social & contact links
  const githubUrl = validLinks.find((l) => l.url.includes('github.com'))?.url || 'https://github.com/ehsaanullah0';
  const emailUrl = validLinks.find((l) => l.url.includes('mailto:') || l.url.includes('@'))?.url || 'mailto:worsmon@proton.me';
  const websiteUrl = validLinks.find((l) => l.url.includes('ehsaan.odoo.com') || l.url.includes('odoo.com'))?.url || 'https://ehsaan.odoo.com';
  const instaLink = validLinks.find((l) => l.url.includes('instagram.com'))?.url;
  const xLink = validLinks.find((l) => l.url.includes('twitter.com') || l.url.includes('x.com'))?.url;

  const socialItems: string[] = [
    `<a class="social" href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" title="GitHub (github.com/ehsaanullah0)">⌘</a>`,
    `<a class="social" href="${escapeHtml(emailUrl.startsWith('mailto:') ? emailUrl : 'mailto:' + emailUrl)}" title="Mail (worsmon@proton.me)">✉</a>`,
    `<a class="social" href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener noreferrer" title="Website (ehsaan.odoo.com)">🌐</a>`,
  ];
  if (instaLink) {
    socialItems.push(`<a class="social" href="${escapeHtml(instaLink)}" target="_blank" rel="noopener noreferrer" title="Instagram">◎</a>`);
  }
  if (xLink) {
    socialItems.push(`<a class="social" href="${escapeHtml(xLink)}" target="_blank" rel="noopener noreferrer" title="X (Twitter)">𝕏</a>`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(heroHeading)} — Multi Link Hub</title>
<meta name="description" content="${escapeHtml(bio)}">
<meta name="theme-color" content="#0F1117">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='none'><circle cx='256' cy='256' r='244' fill='%230A0C10' stroke='%23384158' stroke-width='12'/><path d='M330 148L194 148A46 46 0 0 0 148 194L148 318A46 46 0 0 0 194 364L330 364A22 22 0 0 0 352 342L352 342A22 22 0 0 0 330 320L204 320A14 14 0 0 1 190 306L190 206A14 14 0 0 1 204 192L330 192A22 22 0 0 0 352 170L352 170A22 22 0 0 0 330 148Z' fill='%23FFFFFF'/><rect x='180' y='234' width='108' height='44' rx='14' fill='%23FFFFFF'/><rect x='246' y='242' width='28' height='28' rx='8' fill='%230A0C10'/><circle cx='376' cy='170' r='28' fill='%23E11D48'/><circle cx='376' cy='342' r='10' fill='%23E11D48'/></svg>">
<style>
  :root{
    --bg:#f5f1e8;
    --card:#fffdf8;
    --text:#171717;
    --muted:#77736b;
    --accent:#e7ac08;
    --accent-soft:#f4df9b;
    --line:rgba(23,23,23,.10);
    --shadow:0 18px 55px rgba(23,23,23,.10);
    --radius:24px;
  }
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{
    margin:0;
    min-height:100vh;
    font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    color:var(--text);
    background:
      radial-gradient(circle at 15% 5%,rgba(231,172,8,.18),transparent 25%),
      radial-gradient(circle at 90% 25%,rgba(231,221,193,.65),transparent 30%),
      var(--bg);
  }
  .page{
    width:min(100%,760px);
    margin:auto;
    padding:28px 18px 42px;
  }
  .topbar{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:28px;
  }
  .brand{
    display:flex;
    align-items:center;
    gap:9px;
    font-weight:800;
    letter-spacing:-.04em;
    font-size:14px;
  }
  .brand-mark{
    width:30px;height:30px;border-radius:10px;
    display:grid;place-items:center;
    background:var(--text);color:var(--accent);
    font-size:15px;
  }
  .more{
    width:38px;height:38px;border:1px solid var(--line);
    background:rgba(255,255,255,.6);
    border-radius:50%;font-size:20px;cursor:pointer;
    display:grid;place-items:center;
    transition:.2s;
  }
  .more:hover{
    background:#ffffff;
    transform:translateY(-1px);
    border-color:var(--accent);
  }

  .profile{text-align:center}
  .avatar{
    width:92px;height:92px;border-radius:30px;
    margin:0 auto 16px;
    display:grid;place-items:center;
    background:linear-gradient(145deg,#171717,#34312b);
    color:var(--accent);
    font-size:34px;font-weight:900;
    box-shadow:var(--shadow);
    transform:rotate(-3deg);
    transition:transform .3s ease;
  }
  .avatar:hover{
    transform:rotate(0deg) scale(1.05);
  }
  h1{
    margin:0;
    font-size:clamp(30px,7vw,44px);
    letter-spacing:-.065em;
    line-height:1;
    font-weight:900;
    text-transform:uppercase;
  }
  .handle{margin-top:8px;color:var(--muted);font-size:14px;font-weight:600;}
  .bio{
    max-width:520px;
    margin:16px auto 0;
    line-height:1.55;
    color:#4f4b45;
    font-size:15px;
  }
  .tags{
    display:flex;justify-content:center;gap:7px;flex-wrap:wrap;
    margin:17px 0 28px;
  }
  .tag{
    padding:7px 11px;border-radius:999px;
    background:rgba(255,255,255,.65);
    border:1px solid var(--line);
    font-size:11px;font-weight:700;
    color:#625e56;
    letter-spacing:0.04em;
  }

  .links{display:grid;gap:12px}
  .link{
    position:relative;
    min-height:68px;
    padding:12px 18px;
    display:flex;align-items:center;gap:14px;
    text-decoration:none;color:var(--text);
    background:rgba(255,253,248,.86);
    border:1px solid var(--line);
    border-radius:20px;
    box-shadow:0 8px 25px rgba(23,23,23,.045);
    transition:.22s ease;
    overflow:hidden;
  }
  .link:hover{
    transform:translateY(-3px);
    border-color:rgba(231,172,8,.55);
    box-shadow:0 14px 30px rgba(23,23,23,.09);
  }
  .icon{
    width:42px;height:42px;flex:0 0 42px;
    border-radius:14px;
    display:grid;place-items:center;
    background:#f0ece3;
    font-size:18px;
    font-weight:700;
  }
  .link-main{min-width:0;flex:1}
  .link-title{font-weight:800;font-size:14px;letter-spacing:-0.01em;}
  .link-sub{
    margin-top:3px;color:var(--muted);font-size:12px;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  .arrow{
    font-size:20px;color:#9b978f;
    transition:transform .2s ease, color .2s ease;
  }
  .link:hover .arrow{transform:translateX(3px);color:var(--text)}

  .featured{
    background:var(--text);color:#fff;
    border-color:var(--text);
  }
  .featured .icon{background:var(--accent);color:var(--text)}
  .featured .link-sub{color:#bdb9b0}
  .featured .arrow{color:var(--accent)}

  .section-label{
    display:flex;align-items:center;gap:10px;
    margin:30px 3px 11px;
    color:#77736b;font-size:11px;font-weight:800;
    text-transform:uppercase;letter-spacing:.12em;
  }
  .section-label:after{
    content:"";height:1px;flex:1;background:var(--line);
  }

  .socials{
    display:flex;justify-content:center;gap:10px;margin:28px 0 16px;
  }
  .social{
    width:44px;height:44px;border-radius:15px;
    display:grid;place-items:center;
    border:1px solid var(--line);
    background:rgba(255,255,255,.6);
    color:var(--text);text-decoration:none;font-weight:800;
    font-size:17px;
    transition:.2s;
  }
  .social:hover{background:var(--text);color:#fff;transform:translateY(-2px)}

  ${
    qrCodeDataUrl
      ? `
  .qr-section{
    margin: 32px auto 16px;
    max-width: 280px;
    text-align: center;
    padding: 20px;
    background: rgba(255,253,248,.9);
    border: 1px solid var(--line);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(23,23,23,.05);
  }
  .qr-box{
    width: 160px;
    height: 160px;
    margin: 0 auto 12px;
    background: #fff;
    border-radius: 16px;
    padding: 8px;
    border: 1px solid var(--line);
  }
  .qr-box img{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .qr-tag{
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .08em;
  }
  `
      : ''
  }

  footer{text-align:center;margin-top:16px;color:#918c82;font-size:11px}
  footer strong{color:#5c574f}

  .footer-nav{
    display:flex;justify-content:center;align-items:center;gap:12px;
    margin-top:20px;flex-wrap:wrap;font-size:12px;font-weight:700;
  }
  .footer-nav a{
    color:var(--text);text-decoration:none;
    display:inline-flex;align-items:center;gap:5px;
    transition:color .2s ease;
  }
  .footer-nav a:hover{
    color:var(--accent);
    text-decoration:underline;
  }
  .dot{color:var(--muted);font-weight:400}

  .toast{
    position:fixed;left:50%;bottom:22px;
    transform:translate(-50%,20px);
    opacity:0;pointer-events:none;
    background:#171717;color:white;
    padding:11px 18px;border-radius:999px;
    font-size:12px;font-weight:700;
    box-shadow:0 10px 25px rgba(0,0,0,0.25);
    transition:.25s ease;
    z-index:999;
  }
  .toast.show{opacity:1;transform:translate(-50%,0)}

  @media(max-width:520px){
    .page{padding:20px 14px 30px}
    .avatar{width:82px;height:82px;border-radius:27px;font-size:30px;}
    .link{min-height:64px;padding:10px 14px}
    .icon{width:40px;height:40px;flex-basis:40px}
  }
</style>
</head>
<body>

<main class="page">

  <header class="topbar">
    <div class="brand">
      <svg class="brand-mark" style="border-radius:50%;width:26px;height:26px;display:block;" viewBox="0 0 512 512" fill="none">
        <circle cx="256" cy="256" r="244" fill="#0A0C10" stroke="#384158" stroke-width="14"/>
        <path d="M 330 148 L 194 148 A 46 46 0 0 0 148 194 L 148 318 A 46 46 0 0 0 194 364 L 330 364 A 22 22 0 0 0 352 342 L 352 342 A 22 22 0 0 0 330 320 L 204 320 A 14 14 0 0 1 190 306 L 190 206 A 14 14 0 0 1 204 192 L 330 192 A 22 22 0 0 0 352 170 L 352 170 A 22 22 0 0 0 330 148 Z" fill="#FFFFFF"/>
        <rect x="180" y="234" width="108" height="44" rx="14" fill="#FFFFFF"/>
        <rect x="246" y="242" width="28" height="28" rx="8" fill="#0A0C10"/>
        <circle cx="376" cy="170" r="28" fill="#E11D48"/>
        <circle cx="376" cy="342" r="10" fill="#E11D48"/>
      </svg>
      <span>EHSAAN QR</span>
    </div>
  </header>

  <section class="profile">
    ${
      avatarImage
        ? `<div class="avatar" style="overflow:hidden;"><img src="${escapeHtml(avatarImage)}" alt="Avatar Logo" style="width:100%;height:100%;object-fit:cover;border-radius:28px;" /></div>`
        : `<div class="avatar">${escapeHtml(avatarLetter)}</div>`
    }
    <h1>${escapeHtml(heroHeading)}</h1>
    ${handle ? `<div class="handle">${escapeHtml(handle)}</div>` : ''}

    ${bio ? `<p class="bio">${escapeHtml(bio)}</p>` : ''}

    ${
      tagsList.length > 0
        ? `
    <div class="tags">
      ${tagsList.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('\n      ')}
    </div>`
        : ''
    }
  </section>

  <section class="links">
    ${
      renderedLinks ||
      `<div class="link" style="justify-content:center;"><div class="link-sub">No links configured yet.</div></div>`
    }
  </section>

  ${
    qrCodeDataUrl
      ? `
  <div class="qr-section">
    <div class="qr-box">
      <img src="${qrCodeDataUrl}" alt="QR Code" />
    </div>
    <div class="qr-tag">Scan with your phone</div>
  </div>`
      : ''
  }

  ${
    socialItems.length > 0
      ? `
  <div class="socials">
    ${socialItems.join('\n    ')}
  </div>`
      : ''
  }

  <div class="footer-nav">
    <a href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" id="html-footer-github">
      <span>⌘</span> GitHub
    </a>
    <span class="dot">•</span>
    <a href="${escapeHtml(emailUrl.startsWith('mailto:') ? emailUrl : 'mailto:' + emailUrl)}" id="html-footer-mail">
      <span>✉</span> Mail
    </a>
    <span class="dot">•</span>
    <a href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener noreferrer" id="html-footer-website">
      <span>🌐</span> Website
    </a>
  </div>

  <footer>
    Made with <strong>EHSAAN QR</strong> · QR codes, but make them yours.
  </footer>

</main>

<div class="toast" id="toast"></div>

<script>
function notify(text){
  var toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(function(){ toast.classList.remove('show'); }, 1800);
}
async function sharePage(){
  try{
    if(navigator.share){
      await navigator.share({
        title: ${JSON.stringify(heroHeading)},
        text: ${JSON.stringify('Explore ' + heroHeading + '’s links and projects.')}
      });
    }else{
      await navigator.clipboard.writeText(location.href);
      notify('Page link copied to clipboard');
    }
  }catch(e){
    notify('Page link copied');
  }
}
</script>

</body>
</html>`;
}

/**
 * Triggers browser download of HTML File (.html)
 */
export function downloadMultiUrlAsHtml(data: MultiUrlData, qrCodeDataUrl?: string) {
  const html = generateMultiUrlHtml(data, qrCodeDataUrl);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const filename = `${slugify(data.heroHeading || data.title || 'links')}-hub.html`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
