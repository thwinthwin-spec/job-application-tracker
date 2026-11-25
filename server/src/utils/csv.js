const HEADERS = [
  'Job Title',
  'Company',
  'Location',
  'Employment Type',
  'Posting URL',
  'Date Applied',
  'Status',
  'Contact Name',
  'Contact Email',
  'Notes',
  'Follow-up Date',
  'Interview Date'
];

// Wrap every value in quotes and double any quotes inside the value.
function escapeValue(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  let text = String(value);
  text = text.replace(/"/g, '""');
  return '"' + text + '"';
}

// Show dates as YYYY-MM-DD so spreadsheet programs read them consistently.
function formatDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

// Turn one application document into an array of CSV cells.
function applicationToRow(application) {
  return [
    application.jobTitle,
    application.company,
    application.location,
    application.employmentType,
    application.postingUrl,
    formatDate(application.dateApplied),
    application.status,
    application.contactName,
    application.contactEmail,
    application.notes,
    formatDate(application.followUpDate),
    formatDate(application.interviewDate)
  ];
}

// Build the full CSV text, including the header row.
function toCsv(applications) {
  const lines = [];
  lines.push(HEADERS.map(escapeValue).join(','));

  for (let i = 0; i < applications.length; i += 1) {
    const row = applicationToRow(applications[i]);
    lines.push(row.map(escapeValue).join(','));
  }

  return lines.join('\r\n') + '\r\n';
}

module.exports = { toCsv, escapeValue, formatDate, HEADERS };
