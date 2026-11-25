// Show a friendly date, or a dash when the value is missing.
export function formatDate(value) {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Convert an API date into the value needed by an <input type="date">.
export function toDateInputValue(value) {
  if (!value) {
    return '';
  }
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }
  const date = new Date(text);
  if (isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

// Find the id on an application, whether the API calls it _id or id.
export function getApplicationId(item) {
  if (!item) {
    return '';
  }
  if (item._id) {
    return item._id;
  }
  if (item.id) {
    return item.id;
  }
  return '';
}

// Build a file name like job-applications-2026-11-24.csv.
export function buildCsvFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return 'job-applications-' + year + '-' + month + '-' + day + '.csv';
}

// Turn a user name into up to two initials for the avatar circle.
export function getInitials(name) {
  if (!name) {
    return '?';
  }
  const parts = String(name).trim().split(/\s+/);
  let result = parts[0].charAt(0);
  if (parts.length > 1) {
    result = result + parts[parts.length - 1].charAt(0);
  }
  return result.toUpperCase();
}

// Read a status count safely when the stats response has no data yet.
export function getStatusCount(byStatus, status) {
  if (!byStatus) {
    return 0;
  }
  const value = byStatus[status];
  if (typeof value === 'number') {
    return value;
  }
  return 0;
}
