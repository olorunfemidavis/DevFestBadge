(function () {
  var SUPPORTED_LANGUAGES = {
    en: { name: 'English', native: 'English' },
    es: { name: 'Spanish', native: 'Español' },
    fr: { name: 'French', native: 'Français' },
    pt: { name: 'Portuguese', native: 'Português' },
    yo: { name: 'Yoruba', native: 'Èdè Yorùbá' },
    de: { name: 'German', native: 'Deutsch' },
    tr: { name: 'Turkish', native: 'Türkçe' },
    ar: { name: 'Arabic', native: 'العربية', rtl: true },
    hi: { name: 'Hindi', native: 'हिन्दी' },
    ja: { name: 'Japanese', native: '日本語' },
    ko: { name: 'Korean', native: '한국어' },
    sw: { name: 'Swahili', native: 'Kiswahili' }
  };

  var DEFAULT_LANG = 'en';
  var STORAGE_KEY = 'devfest_badge_lang';
  var currentLang = DEFAULT_LANG;
  var dictionaries = {};

  var EMBEDDED_EN = {
    "app_title": "Badge Creator",
    "app_tagline": "Create print badges from attendee data.",
    "data_heading": "Data",
    "upload_title": "Upload attendee file",
    "choose_file_prompt": "Choose CSV, XLSX, or JSON",
    "no_file_selected": "No file selected",
    "preview_heading": "Preview",
    "preview_title": "First badge",
    "export_heading": "Export",
    "actions_title": "Download badges",
    "download_zip": "Download ZIP",
    "community_count": "{year} community count: {count} badges",
    "sample_csv": "Sample CSV",
    "sample_xlsx": "Sample XLSX",
    "sample_json": "Sample JSON",
    "language_selector_label": "Language",

    "footer_built_with": "Built with",
    "footer_by": "by",
    "footer_and": "and",

    "type_general": "General",
    "type_speaker": "Speaker",
    "type_staff": "Staff",
    "type_attendee": "Attendee",

    "stat_prefix": "{year} community count:",
    "stat_suffix": "badges",

    "field_firstname": "firstname",
    "field_lastname": "lastname",
    "field_location": "location",

    "status_initial": "Ready",
    "status_reading": "Reading file...",
    "status_no_valid_rows": "No valid badge rows found.",
    "status_rendering_first": "Rendering first badge...",
    "status_ready_count": "{count} badge{plural} ready from {rawCount} row{rawPlural}.",
    "status_preparing_zip": "Preparing ZIP...",
    "status_generating_progress": "Generated {current} of {total} badges...",
    "status_compressing_zip": "Compressing ZIP...",
    "status_downloaded_count": "{total} badge{plural} downloaded.",
    "status_download_failed": "Badge download failed.",
    "status_could_not_parse": "Could not parse this file.",
    "status_could_not_init": "Could not initialize badge creator.",

    "validation_issues_skipped": "{count} row issue{plural} skipped",
    "validation_warnings_applied": "{count} warning{plural} applied",
    "val_missing_field": "Row {rowNumber}: missing {field}.",
    "val_unknown_type": "Row {rowNumber}: unknown participationType \"{rawType}\"; using {fallback}."
  };

  dictionaries.en = EMBEDDED_EN;

  function detectLanguage() {
    var params = new URLSearchParams(window.location.search);
    var queryLang = params.get('lang') || params.get('locale');
    if (queryLang && normalizeLangCode(queryLang)) {
      return normalizeLangCode(queryLang);
    }

    var savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && normalizeLangCode(savedLang)) {
      return normalizeLangCode(savedLang);
    }

    var browserLangs = window.navigator.languages || [window.navigator.language || window.navigator.userLanguage];
    for (var i = 0; i < browserLangs.length; i += 1) {
      var code = normalizeLangCode(browserLangs[i]);
      if (code) return code;
    }

    return DEFAULT_LANG;
  }

  function normalizeLangCode(raw) {
    if (!raw) return null;
    var clean = String(raw).trim().toLowerCase().split('-')[0];
    return SUPPORTED_LANGUAGES[clean] ? clean : null;
  }

  async function loadDictionary(lang) {
    if (dictionaries[lang]) return dictionaries[lang];

    try {
      var response = await fetch('locales/' + lang + '.json');
      if (!response.ok) throw new Error('Could not fetch locale file');
      var dict = await response.json();
      dictionaries[lang] = dict;
      return dict;
    } catch (error) {
      console.warn('[i18n] Fallback to English for lang:', lang, error);
      return dictionaries.en;
    }
  }

  function t(key, params) {
    var dict = dictionaries[currentLang] || dictionaries.en;
    var template = dict[key] || dictionaries.en[key] || key;

    params = params || {};

    if (!('plural' in params) && ('count' in params)) {
      params.plural = isNoPluralLang(currentLang) ? '' : (params.count === 1 ? '' : 's');
    }
    if (!('rawPlural' in params) && ('rawCount' in params)) {
      params.rawPlural = isNoPluralLang(currentLang) ? '' : (params.rawCount === 1 ? '' : 's');
    }

    var result = String(template);
    Object.keys(params).forEach(function (param) {
      result = result.replace(new RegExp('\\{' + param + '\\}', 'g'), params[param]);
    });

    return result;
  }

  function isNoPluralLang(lang) {
    return ['yo', 'ja', 'ko', 'hi', 'tr', 'sw', 'ar'].indexOf(lang) !== -1;
  }

  function applyDomTranslations() {
    if (typeof document === 'undefined') return;

    var langConfig = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;
    if (document.documentElement) {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = langConfig.rtl ? 'rtl' : 'ltr';
    }

    var currentYear = new Date().getFullYear();
    var i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(function (elem) {
      var key = elem.getAttribute('data-i18n');
      if (key === 'stat_prefix') {
        elem.textContent = t(key, { year: currentYear });
      } else if (key) {
        elem.textContent = t(key);
      }
    });

    var selectElem = document.getElementById('language-select');
    if (selectElem && selectElem.value !== currentLang) {
      selectElem.value = currentLang;
    }
  }

  async function setLanguage(lang) {
    var normalized = normalizeLangCode(lang) || DEFAULT_LANG;
    currentLang = normalized;
    localStorage.setItem(STORAGE_KEY, normalized);

    await loadDictionary(normalized);
    applyDomTranslations();

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: normalized } }));
    }
  }

  async function init() {
    var detected = detectLanguage();
    currentLang = detected;
    await loadDictionary(detected);
    applyDomTranslations();
  }

  window.i18n = {
    t: t,
    init: init,
    setLanguage: setLanguage,
    getCurrentLanguage: function () { return currentLang; },
    getSupportedLanguages: function () { return SUPPORTED_LANGUAGES; }
  };
})();
