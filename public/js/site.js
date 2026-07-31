(function () {
  var fileInput = document.getElementById('file-upload');
  var fileDrop = document.getElementById('file-drop');
  var fileName = document.getElementById('file-name');
  var badgePreview = document.getElementById('badge-preview');
  var downloadBtn = document.getElementById('download-btn');
  var countLabel = document.getElementById('badge-count-label');
  var validationSummary = document.getElementById('validation-summary');
  var previewType = document.getElementById('preview-type');
  var progressContainer = document.getElementById('progress-container');
  var progressBar = document.getElementById('progress-bar');
  var countSpan = document.getElementById('countSpan');
  var yearSpan = document.getElementById('year');
  var exportSection = document.getElementById('export-section');
  var langSelect = document.getElementById('language-select');

  var attendeeList = [];
  var lastParseResult = null;
  var hasTrackedUploadForCurrentFile = false;
  var badgeConfig = null;
  var jsZipPromise = null;
  var currentStatusState = null;

  function t(key, params) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key, params);
    }
    return key;
  }

  function setStatusKey(key, params) {
    currentStatusState = { key: key, params: params };
    countLabel.textContent = key ? t(key, params) : '';
  }

  function refreshCurrentStatus() {
    if (currentStatusState && currentStatusState.key) {
      countLabel.textContent = t(currentStatusState.key, currentStatusState.params);
    }
  }

  var currentPreviewType = 'general';

  function setPreviewType(type) {
    currentPreviewType = window.badgeRenderer.normalizeTemplateType(type || 'general');
    refreshPreviewTypePill();
  }

  function refreshPreviewTypePill() {
    var key = 'type_' + currentPreviewType;
    previewType.textContent = t(key);
  }

  function titleCase(value) {
    return String(value || '').replace(/\b\w/g, function (letter) { return letter.toUpperCase(); });
  }

  function setProgress(value, label) {
    var percent = Math.max(0, Math.min(100, value));
    progressBar.style.width = percent + '%';
    progressBar.textContent = label || percent + '%';
    progressBar.setAttribute('aria-valuenow', String(percent));
  }

  function setBusy(isBusy) {
    downloadBtn.disabled = isBusy || !attendeeList.length;
    fileInput.disabled = isBusy;
    document.body.classList.toggle('is-busy', isBusy);
  }

  function formatValidationItem(item) {
    if (item && item.code === 'missing_field') {
      var fieldLabel = t('field_' + item.field) || item.field;
      return t('val_missing_field', { rowNumber: item.rowNumber, field: fieldLabel });
    }
    if (item && item.code === 'unknown_type') {
      var fallbackLabel = t('type_general');
      return t('val_unknown_type', { rowNumber: item.rowNumber, rawType: item.rawType, fallback: fallbackLabel });
    }
    return String(item);
  }

  function summarizeValidation(result) {
    lastParseResult = result;
    if (!result) {
      validationSummary.hidden = true;
      validationSummary.innerHTML = '';
      return;
    }

    var parts = [];
    if (result.errors && result.errors.length) {
      parts.push('<strong>' + t('validation_issues_skipped', { count: result.errors.length }) + '</strong>');
    }
    if (result.warnings && result.warnings.length) {
      parts.push('<strong>' + t('validation_warnings_applied', { count: result.warnings.length }) + '</strong>');
    }

    if (!parts.length) {
      validationSummary.hidden = true;
      validationSummary.innerHTML = '';
      return;
    }

    var examples = result.errors.concat(result.warnings)
      .slice(0, 5)
      .map(function (item) { return escapeHtml(formatValidationItem(item)); })
      .join('<br>');

    validationSummary.innerHTML = parts.join(' &amp; ') + '.<br>' + examples;
    validationSummary.hidden = false;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function loadScript(src, globalName) {
    if (globalName && window[globalName]) return Promise.resolve(window[globalName]);

    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-src="' + src + '"]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(globalName ? window[globalName] : true); });
        existing.addEventListener('error', reject);
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.src = src;
      script.onload = function () { resolve(globalName ? window[globalName] : true); };
      script.onerror = function () { reject(new Error('Could not load ' + src)); };
      document.head.appendChild(script);
    });
  }

  function ensureJsZip() {
    if (!jsZipPromise) {
      jsZipPromise = loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js', 'JSZip');
    }
    return jsZipPromise;
  }

  function nextFrame() {
    return new Promise(function (resolve) {
      requestAnimationFrame(function () { resolve(); });
    });
  }

  async function loadInitialState() {
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    if (window.i18n && typeof window.i18n.init === 'function') {
      await window.i18n.init();
    }

    window.trackBadgeSiteVisit();
    window.readBadgeTotalCount(function (count) {
      countSpan.textContent = count;
    });

    badgeConfig = await window.badgeRenderer.loadBadgeConfig();
    await window.badgeRenderer.renderBadge(badgePreview, null, badgeConfig);
    setPreviewType('general');
  }

  async function handleFile(file) {
    if (!file) return;

    fileName.textContent = file.name;
    setStatusKey('status_reading');
    validationSummary.hidden = true;
    downloadBtn.disabled = true;
    if (exportSection) exportSection.hidden = true;
    hasTrackedUploadForCurrentFile = false;

    try {
      var result = await window.parseAttendeeFile(file);
      attendeeList = result.attendees;
      summarizeValidation(result);

      if (!attendeeList.length) {
        setStatusKey('status_no_valid_rows');
        if (exportSection) exportSection.hidden = true;
        await window.badgeRenderer.renderBadge(badgePreview, null, badgeConfig);
        setPreviewType('general');
        return;
      }

      setStatusKey('status_rendering_first');
      await window.badgeRenderer.renderBadge(badgePreview, attendeeList[0], badgeConfig);
      setPreviewType(attendeeList[0].participationType);
      if (exportSection) exportSection.hidden = false;
      downloadBtn.disabled = false;
      setStatusKey('status_ready_count', { count: attendeeList.length, rawCount: result.rawCount });
    } catch (error) {
      attendeeList = [];
      if (exportSection) exportSection.hidden = true;
      setStatusKey('status_could_not_parse');
      validationSummary.innerHTML = escapeHtml(error.message || error);
      validationSummary.hidden = false;
      await window.badgeRenderer.renderBadge(badgePreview, null, badgeConfig);
      setPreviewType('general');
    }
  }

  async function downloadAllBadges() {
    if (!attendeeList.length) return;

    setBusy(true);
    progressContainer.hidden = false;
    setProgress(0, '0%');
    setStatusKey('status_preparing_zip');

    try {
      var JSZip = await ensureJsZip();
      var zip = new JSZip();
      var total = attendeeList.length;

      for (var i = 0; i < total; i += 1) {
        var attendee = attendeeList[i];
        var blob = await window.badgeRenderer.generateBadgeBlob(attendee, badgeConfig);
        var filename = [
          String(i + 1).padStart(4, '0'),
          window.badgeRenderer.sanitizeFilename(attendee.firstname),
          window.badgeRenderer.sanitizeFilename(attendee.lastname)
        ].filter(Boolean).join('-') + '.png';

        zip.file(filename, blob);

        if ((i + 1) % 5 === 0 || i + 1 === total) {
          var progress = Math.round(((i + 1) / total) * 100);
          setProgress(progress, progress + '%');
          setStatusKey('status_generating_progress', { current: i + 1, total: total });
          await nextFrame();
        }
      }

      setStatusKey('status_compressing_zip');
      var zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } }, function (metadata) {
        setProgress(Math.round(metadata.percent), Math.round(metadata.percent) + '%');
      });

      var url = URL.createObjectURL(zipBlob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'devfest-2026-badges.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 30000);

      setStatusKey('status_downloaded_count', { total: total });
      if (!hasTrackedUploadForCurrentFile) {
        window.trackBadgeFileUpload(total);
        hasTrackedUploadForCurrentFile = true;
      }
      window.trackBadgesGenerated(total, function (newCount) {
        countSpan.textContent = newCount;
      });
    } catch (error) {
      setStatusKey('status_download_failed');
      validationSummary.innerHTML = escapeHtml(error.message || error);
      validationSummary.hidden = false;
    } finally {
      setBusy(false);
      setTimeout(function () {
        progressContainer.hidden = true;
        setProgress(0, '0%');
      }, 1600);
    }
  }

  fileInput.addEventListener('change', function (event) {
    handleFile(event.target.files[0]);
  });

  fileDrop.addEventListener('dragover', function (event) {
    event.preventDefault();
    fileDrop.classList.add('is-dragging');
  });

  fileDrop.addEventListener('dragleave', function () {
    fileDrop.classList.remove('is-dragging');
  });

  fileDrop.addEventListener('drop', function (event) {
    event.preventDefault();
    fileDrop.classList.remove('is-dragging');
    var file = event.dataTransfer.files[0];
    handleFile(file);
  });

  downloadBtn.addEventListener('click', downloadAllBadges);

  if (langSelect) {
    langSelect.addEventListener('change', function (e) {
      if (window.i18n && typeof window.i18n.setLanguage === 'function') {
        window.i18n.setLanguage(e.target.value);
      }
    });
  }

  window.addEventListener('languagechange', function () {
    refreshCurrentStatus();
    refreshPreviewTypePill();
    if (lastParseResult) {
      summarizeValidation(lastParseResult);
    }
  });

  window.addEventListener('DOMContentLoaded', function () {
    loadInitialState().catch(function (error) {
      setStatusKey('status_could_not_init');
      validationSummary.textContent = error.message || error;
      validationSummary.hidden = false;
    });
  });
})();
