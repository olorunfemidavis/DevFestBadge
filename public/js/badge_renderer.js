(function () {
  var BADGE_WIDTH = 1310;
  var BADGE_HEIGHT = 2048;
  var FALLBACK_TEMPLATE = 'badge';
  var VALID_TEMPLATES = ['attendee', 'speaker', 'general', 'staff', 'badge'];
  var imageCache = {};
  var configPromise = null;
  var fontsPromise = null;

  function loadFonts() {
    if (!fontsPromise) {
      fontsPromise = document.fonts ? document.fonts.ready.catch(function () { return true; }) : Promise.resolve(true);
    }
    return fontsPromise;
  }

  function loadBadgeConfig() {
    if (!configPromise) {
      configPromise = fetch('files/badgeConfig.json').then(function (response) {
        if (!response.ok) throw new Error('Could not load badgeConfig.json');
        return response.json();
      });
    }
    return configPromise;
  }

  function normalizeTemplateType(type) {
    var value = String(type || '').toLowerCase().trim();
    return VALID_TEMPLATES.indexOf(value) !== -1 ? value : 'general';
  }

  function loadTemplate(type) {
    var template = normalizeTemplateType(type);
    if (imageCache[template]) return imageCache[template];

    imageCache[template] = new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () {
        if (template !== FALLBACK_TEMPLATE) {
          loadTemplate(FALLBACK_TEMPLATE).then(resolve);
        } else {
          resolve(null);
        }
      };
      img.src = 'images/badge/' + template + '.png';
    });

    return imageCache[template];
  }

  function fitFontSize(ctx, text, conf) {
    var size = Number(conf.fontsize) || 48;
    var minSize = Math.max(22, Math.round(size * 0.48));
    var family = conf.fontfamily || 'Google Sans';

    while (size > minSize) {
      ctx.font = (conf.fontweight || '400') + ' ' + size + 'px "' + family + '", Arial, sans-serif';
      if (ctx.measureText(text).width <= conf.w) return size;
      size -= 2;
    }

    return size;
  }

  function drawField(ctx, attendee, key, conf) {
    var text = String(attendee[key] || '').trim();
    if (!text) return;

    var size = fitFontSize(ctx, text, conf);
    var family = conf.fontfamily || 'Google Sans';
    ctx.font = (conf.fontweight || '400') + ' ' + size + 'px "' + family + '", Arial, sans-serif';
    ctx.textAlign = conf.align || 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#222222';

    var xPos = Number(conf.x) || 0;
    if (conf.align === 'center') xPos += (Number(conf.w) || 0) / 2;
    if (conf.align === 'right') xPos += Number(conf.w) || 0;

    ctx.fillText(text, xPos, (Number(conf.y) || 0) + (Number(conf.h) || 0) / 2);
  }

  async function renderBadge(canvas, attendee, config) {
    await loadFonts();
    var ctx = canvas.getContext('2d');
    var type = attendee ? attendee.participationType : FALLBACK_TEMPLATE;
    var img = await loadTemplate(type || FALLBACK_TEMPLATE);

    canvas.width = BADGE_WIDTH;
    canvas.height = BADGE_HEIGHT;
    ctx.clearRect(0, 0, BADGE_WIDTH, BADGE_HEIGHT);

    if (img) ctx.drawImage(img, 0, 0, BADGE_WIDTH, BADGE_HEIGHT);

    if (attendee && config) {
      Object.keys(config).forEach(function (key) {
        drawField(ctx, attendee, key, config[key]);
      });
    }
  }

  function canvasToBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) { resolve(blob); }, 'image/png');
    });
  }

  async function generateBadgeBlob(attendee, config) {
    var canvas = document.createElement('canvas');
    await renderBadge(canvas, attendee, config);
    return canvasToBlob(canvas);
  }

  function sanitizeFilename(value) {
    return String(value || '')
      .trim()
      .replace(/[^a-z0-9-_]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'badge';
  }

  window.badgeRenderer = {
    BADGE_WIDTH: BADGE_WIDTH,
    BADGE_HEIGHT: BADGE_HEIGHT,
    loadBadgeConfig: loadBadgeConfig,
    loadFonts: loadFonts,
    normalizeTemplateType: normalizeTemplateType,
    renderBadge: renderBadge,
    generateBadgeBlob: generateBadgeBlob,
    sanitizeFilename: sanitizeFilename
  };
})();

