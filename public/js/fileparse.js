(function () {
  var REQUIRED_FIELDS = ['location', 'firstname', 'lastname'];
  var OPTIONAL_FIELDS = ['title', 'organization', 'participationType'];
  var ALL_FIELDS = REQUIRED_FIELDS.concat(OPTIONAL_FIELDS);
  var PARTICIPATION_TYPES = ['attendee', 'speaker', 'general', 'staff'];
  var xlsxPromise = null;

  var FIELD_ALIASES = {
    // English & Default
    firstName: 'firstname',
    first_name: 'firstname',
    first: 'firstname',
    givenName: 'firstname',
    lastName: 'lastname',
    last_name: 'lastname',
    surname: 'lastname',
    familyName: 'lastname',
    role: 'title',
    jobTitle: 'title',
    company: 'organization',
    organisation: 'organization',
    org: 'organization',
    chapter: 'location',
    city: 'location',
    gdg: 'location',
    type: 'participationType',
    participation: 'participationType',
    badgeType: 'participationType',

    // Yoruba (Èdè Yorùbá)
    oruko: 'firstname',
    orukofirst: 'firstname',
    orukolast: 'lastname',
    ibo: 'location',
    aye: 'location',
    ipo: 'title',
    akori: 'title',
    egbe: 'organization',

    // Spanish (Español)
    nombre: 'firstname',
    primerNombre: 'firstname',
    apellido: 'lastname',
    apellidos: 'lastname',
    ciudad: 'location',
    empresa: 'organization',
    cargo: 'title',
    puesto: 'title',
    rol: 'title',
    tipo: 'participationType',
    tipoParticipacion: 'participationType',

    // French (Français)
    prenom: 'firstname',
    prénom: 'firstname',
    nom: 'lastname',
    nomDeFamille: 'lastname',
    ville: 'location',
    societe: 'organization',
    société: 'organization',
    entreprise: 'organization',
    titre: 'title',
    poste: 'title',

    // Portuguese (Português)
    nome: 'firstname',
    primeiroNome: 'firstname',
    primeiro_nome: 'firstname',
    sobrenome: 'lastname',
    apelido: 'lastname',
    cidade: 'location',
    empresa: 'organization',
    organizacao: 'organization',
    organização: 'organization',
    cargo: 'title',
    funcao: 'title',
    função: 'title',
    tipo: 'participationType',

    // German (Deutsch)
    vorname: 'firstname',
    nachname: 'lastname',
    familienname: 'lastname',
    stadt: 'location',
    ort: 'location',
    firma: 'organization',
    unternehmen: 'organization',
    titel: 'title',
    typ: 'participationType',
    art: 'participationType',

    // Turkish (Türkçe)
    ad: 'firstname',
    isim: 'firstname',
    soyad: 'lastname',
    soyisim: 'lastname',
    sehir: 'location',
    şehir: 'location',
    sirket: 'organization',
    şirket: 'organization',
    unvan: 'title',
    ünvan: 'title',
    gorev: 'title',
    görev: 'title',
    tur: 'participationType',
    tür: 'participationType',

    // Swahili (Kiswahili)
    jinakwanza: 'firstname',
    jinapili: 'lastname',
    mahali: 'location',
    mji: 'location',
    shirika: 'organization',
    kampuni: 'organization',
    kazi: 'title',
    cheo: 'title',
    aina: 'participationType'
  };

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
      script.onerror = function () { reject(new Error('Could not load parser dependency: ' + src)); };
      document.head.appendChild(script);
    });
  }

  function ensureXlsx() {
    if (!xlsxPromise) {
      xlsxPromise = loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', 'XLSX');
    }
    return xlsxPromise;
  }

  function readFileAsText(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (event) { resolve(event.target.result); };
      reader.onerror = function () { reject(reader.error || new Error('Could not read file.')); };
      reader.readAsText(file);
    });
  }

  function readFileAsArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (event) { resolve(event.target.result); };
      reader.onerror = function () { reject(reader.error || new Error('Could not read file.')); };
      reader.readAsArrayBuffer(file);
    });
  }

  function parseCsv(text) {
    var rows = [];
    var current = [];
    var value = '';
    var inQuotes = false;

    for (var i = 0; i < text.length; i += 1) {
      var char = text[i];
      var next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          value += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        current.push(value);
        value = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') i += 1;
        current.push(value);
        if (current.some(function (cell) { return cell.trim() !== ''; })) rows.push(current);
        current = [];
        value = '';
      } else {
        value += char;
      }
    }

    current.push(value);
    if (current.some(function (cell) { return cell.trim() !== ''; })) rows.push(current);
    if (!rows.length) return [];

    var headers = rows[0].map(function (header) { return normalizeFieldName(header); });
    return rows.slice(1).map(function (row) {
      return headers.reduce(function (record, header, index) {
        if (header) record[header] = row[index] || '';
        return record;
      }, {});
    });
  }

  function normalizeFieldName(field) {
    var raw = String(field || '').trim();
    if (!raw) return '';
    var compact = raw.replace(/\s+/g, '').replace(/[-_]/g, '');
    var lower = compact.charAt(0).toLowerCase() + compact.slice(1);
    var aliasKeys = Object.keys(FIELD_ALIASES);

    if (ALL_FIELDS.indexOf(raw) !== -1) return raw;
    if (ALL_FIELDS.map(function (name) { return name.toLowerCase(); }).indexOf(raw.toLowerCase()) !== -1) {
      return ALL_FIELDS.find(function (name) { return name.toLowerCase() === raw.toLowerCase(); });
    }

    for (var i = 0; i < aliasKeys.length; i += 1) {
      if (aliasKeys[i].toLowerCase() === lower.toLowerCase()) return FIELD_ALIASES[aliasKeys[i]];
    }

    return raw;
  }

  function normalizeRecord(record) {
    return Object.keys(record || {}).reduce(function (normalized, key) {
      var field = normalizeFieldName(key);
      if (!field) return normalized;
      normalized[field] = record[key];
      return normalized;
    }, {});
  }

  function cleanValue(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function normalizeParticipationType(value, warnings, rowNumber) {
    var type = cleanValue(value).toLowerCase();
    if (!type) return 'general';
    if (PARTICIPATION_TYPES.indexOf(type) !== -1) return type;

    var raw = cleanValue(value);
    var msg = new String('Row ' + rowNumber + ': unknown participationType "' + raw + '"; using General.');
    msg.code = 'unknown_type';
    msg.rowNumber = rowNumber;
    msg.rawType = raw;
    warnings.push(msg);
    return 'general';
  }

  function validateRows(rows) {
    var errors = [];
    var warnings = [];
    var attendees = [];

    rows.forEach(function (row, index) {
      var rowNumber = index + 2;
      var normalized = normalizeRecord(row);
      var attendee = {};

      ALL_FIELDS.forEach(function (field) {
        attendee[field] = cleanValue(normalized[field]);
      });

      REQUIRED_FIELDS.forEach(function (field) {
        if (!attendee[field]) {
          var msg = new String('Row ' + rowNumber + ': missing ' + field + '.');
          msg.code = 'missing_field';
          msg.rowNumber = rowNumber;
          msg.field = field;
          errors.push(msg);
        }
      });

      if (!attendee.firstname || !attendee.lastname || !attendee.location) return;

      attendee.participationType = normalizeParticipationType(attendee.participationType, warnings, rowNumber);
      attendees.push(attendee);
    });

    return {
      attendees: attendees,
      errors: errors,
      warnings: warnings,
      rawCount: rows.length
    };
  }

  async function parseAttendeeFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    var rows;

    if (ext === 'csv') {
      rows = parseCsv(await readFileAsText(file));
    } else if (ext === 'json') {
      var data = JSON.parse(await readFileAsText(file));
      rows = Array.isArray(data) ? data : [data];
    } else if (ext === 'xlsx') {
      await ensureXlsx();
      var buffer = await readFileAsArrayBuffer(file);
      var workbook = window.XLSX.read(buffer, { type: 'array' });
      var sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = window.XLSX.utils.sheet_to_json(sheet, { defval: '' });
    } else {
      throw new Error('Unsupported file type. Use CSV, XLSX, or JSON.');
    }

    return validateRows(rows || []);
  }

  window.parseAttendeeFile = parseAttendeeFile;
  window.validateBadgeRows = validateRows;
})();
