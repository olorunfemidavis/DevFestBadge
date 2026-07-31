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

  var attendeeList = [];
  var badgeConfig = null;
  var jsZipPromise = null;

  function setStatus(message) {
    countLabel.textContent = message || '';
  }

  function setPreviewType(type) {
    previewType.textContent = titleCase(window.badgeRenderer.normalizeTemplateType(type || 'general'));
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

  function summarizeValidation(result) {
    var parts = [];
    if (result.errors.length) parts.push('<strong>' + result.errors.length + ' row issue' + (result.errors.length === 1 ? '' : 's') + '</strong> skipped');
    if (result.warnings.length) parts.push('<strong>' + result.warnings.length + ' warning' + (result.warnings.length === 1 ? '' : 's') + '</strong> applied');

    if (!parts.length) {
      validationSummary.hidden = true;
      validationSummary.innerHTML = '';
      return;
    }

    var examples = result.errors.concat(result.warnings).slice(0, 5).map(escapeHtml).join('<br>');
    validationSummary.innerHTML = parts.join(' and ') + '.<br>' + examples;
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
    yearSpan.textContent = new Date().getFullYear();
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
    setStatus('Reading file...');
    validationSummary.hidden = true;
    downloadBtn.disabled = true;

    try {
      var result = await window.parseAttendeeFile(file);
      attendeeList = result.attendees;
      summarizeValidation(result);

      if (!attendeeList.length) {
        setStatus('No valid badge rows found.');
        await window.badgeRenderer.renderBadge(badgePreview, null, badgeConfig);
        setPreviewType('general');
        return;
      }

      setStatus('Rendering first badge...');
      await window.badgeRenderer.renderBadge(badgePreview, attendeeList[0], badgeConfig);
      setPreviewType(attendeeList[0].participationType);
      downloadBtn.disabled = false;
      setStatus(attendeeList.length + ' badge' + (attendeeList.length === 1 ? '' : 's') + ' ready from ' + result.rawCount + ' row' + (result.rawCount === 1 ? '' : 's') + '.');
      window.trackBadgeFileUpload(attendeeList.length);
    } catch (error) {
      attendeeList = [];
      setStatus('Could not parse this file.');
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
    setStatus('Preparing ZIP...');

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
          setStatus('Generated ' + (i + 1) + ' of ' + total + ' badges...');
          await nextFrame();
        }
      }

      setStatus('Compressing ZIP...');
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

      setStatus(total + ' badge' + (total === 1 ? '' : 's') + ' downloaded.');
      window.trackBadgesGenerated(total, function (newCount) {
        countSpan.textContent = newCount;
      });
    } catch (error) {
      setStatus('Badge download failed.');
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

  window.addEventListener('DOMContentLoaded', function () {
    loadInitialState().catch(function (error) {
      setStatus('Could not initialize badge creator.');
      validationSummary.textContent = error.message || error;
      validationSummary.hidden = false;
    });
  });
})();

