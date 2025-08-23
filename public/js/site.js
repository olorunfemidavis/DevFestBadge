// DevFest 2025 Badge Generator JS
// Handles file upload, parsing, badge rendering, configuration, and download

// TODO: Add support for CSV, XLSX, and JSON parsing
// TODO: Add badge rendering logic using Canvas
// TODO: Add configuration controls for text positions, sizes, justification
// TODO: Add ZIP download functionality
// TODO: Add theme detection and UI adaptation

// Utility: Use Google Fonts via CSS only
// Remove FontFace loading

// Elements
const fileInput = document.getElementById('file-upload');
const badgePreview = document.getElementById('badge-preview');
const downloadBtn = document.getElementById('download-btn');

let attendeeList = [];
let badgeConfig = {};

// Load badgeConfig from JSON file (no fallback)
fetch('files/badgeConfig.json')
  .then(res => res.json())
  .then(config => {
    badgeConfig = config;
    if (attendeeList.length) renderBadgePreview(attendeeList[0]);
  })
  .catch(() => {
    alert('Could not load badgeConfig.json. Using defaults.');
  });

// Load fileparse.js for parsing
const fileParseScript = document.createElement('script');
fileParseScript.src = 'js/fileparse.js';
document.head.appendChild(fileParseScript);

// Set canvas size for badge template
badgePreview.width = 1310;
badgePreview.height = 2048;

// Show badge template image on page load
window.addEventListener('DOMContentLoaded', () => {
  const ctx = badgePreview.getContext('2d');
  const img = new Image();
  img.onload = function() {
    ctx.clearRect(0, 0, badgePreview.width, badgePreview.height);
    ctx.drawImage(img, 0, 0, badgePreview.width, badgePreview.height);
  };
  img.src = 'images/badge/badge.png';

  // Set year and badge count in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('countSpan').textContent = attendeeList.length || 0;
});

// File upload handler
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    attendeeList = await window.parseAttendeeFile(file);
    if (!attendeeList.length) throw new Error('No attendees found');
    document.getElementById('countSpan').textContent = attendeeList.length;
    document.getElementById('badge-count-label').textContent = `${attendeeList.length} badge${attendeeList.length === 1 ? '' : 's'} loaded`;
    // Generate and display badge for the first attendee
    renderBadgePreview(attendeeList[0]);
    downloadBtn.disabled = false;
  } catch (err) {
    alert('Error parsing file: ' + err);
    document.getElementById('badge-count-label').textContent = '';
  }
});

// Render badge preview for first attendee
function renderBadgePreview(attendee) {
  const ctx = badgePreview.getContext('2d');
  let type = (attendee && attendee.participationType) ? attendee.participationType.toLowerCase() : 'general';
  let imgSrc = `images/badge/${type}.png`;
  const img = new Image();
  img.onload = function() {
    ctx.clearRect(0, 0, badgePreview.width, badgePreview.height);
    ctx.drawImage(img, 0, 0, badgePreview.width, badgePreview.height);
    if (attendee) {
      Object.keys(badgeConfig).forEach(key => {
        const conf = badgeConfig[key];
        ctx.font = `${conf.fontsize}px ${conf.fontfamily}`;
        ctx.textAlign = conf.align;
        ctx.fillStyle = '#222';
        // For left alignment, use x as is; for center, x + w/2
        let xPos = conf.x;
        if (conf.align === 'center') xPos = conf.x + conf.w/2;
        ctx.fillText(attendee[key] || '', xPos, conf.y + conf.h/2);
      });
    }
  };
  img.onerror = function() {
    if (imgSrc !== 'images/badge/badge.png') {
      img.src = 'images/badge/badge.png';
    }
  };
  img.src = imgSrc;
}

// Download all badges as ZIP
// TODO: Implement badge generation for all attendees and ZIP packaging
// Load JSZip from CDN
if (!window.JSZip) {
  const jszipScript = document.createElement('script');
  jszipScript.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
  document.head.appendChild(jszipScript);
}
downloadBtn.addEventListener('click', async () => {
  if (!window.JSZip) {
    alert('JSZip not loaded yet. Try again in a moment.');
    return;
  }
  const zip = new JSZip();
  for (let i = 0; i < attendeeList.length; i++) {
    const attendee = attendeeList[i];
    // Render badge to canvas
    renderBadgePreview(attendee);
    // Get image data
    const dataUrl = badgePreview.toDataURL('image/png');
    zip.file(`badge_${i+1}_${attendee.firstname}_${attendee.lastname}.png`, dataUrl.split(',')[1], {base64: true});
  }
  const content = await zip.generateAsync({type: 'blob'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(content);
  a.download = 'devfest_badges.zip';
  a.click();
});

// Toggle footer content visibility
document.getElementById('footer-toggle').addEventListener('click', function() {
  const content = document.getElementById('footer-content');
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'flex';
  } else {
    content.style.display = 'none';
  }
});

// TODO: Add theme detection and UI adaptation
