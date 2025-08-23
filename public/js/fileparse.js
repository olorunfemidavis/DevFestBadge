// Utility JS for parsing CSV, XLSX, and JSON files
// Uses PapaParse for CSV, SheetJS for XLSX
// Exports: parseAttendeeFile(file): Promise<attendeeList>

// Load PapaParse and SheetJS from CDN
if (!window.Papa) {
  const papaScript = document.createElement('script');
  papaScript.src = 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js';
  document.head.appendChild(papaScript);
}
if (!window.XLSX) {
  const xlsxScript = document.createElement('script');
  xlsxScript.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
  document.head.appendChild(xlsxScript);
}

function parseAttendeeFile(file) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = function(e) {
      if (ext === 'csv') {
        const results = Papa.parse(e.target.result, { header: true });
        resolve(results.data);
      } else if (ext === 'xlsx') {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        resolve(data);
      } else if (ext === 'json') {
        try {
          const data = JSON.parse(e.target.result);
          resolve(Array.isArray(data) ? data : [data]);
        } catch (err) {
          reject(err);
        }
      } else {
        reject('Unsupported file type');
      }
    };
    if (ext === 'xlsx') reader.readAsBinaryString(file);
    else reader.readAsText(file);
  });
}
window.parseAttendeeFile = parseAttendeeFile;
