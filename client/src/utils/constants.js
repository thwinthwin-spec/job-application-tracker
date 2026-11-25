// The status values accepted by the API.
export const STATUSES = [
  'Saved',
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

// The employment types accepted by the API.
export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Temporary',
];

// Options for the sort controls on the applications page.
export const SORT_FIELDS = [
  { value: 'dateApplied', label: 'Date applied' },
  { value: 'company', label: 'Company' },
  { value: 'jobTitle', label: 'Job title' },
];

export const SORT_ORDERS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export const DEFAULT_PAGE_SIZE = 10;

// Shortcuts shown on the login and registration pages.
export const DEMO_ACCOUNTS = [
  {
    label: 'Demo account',
    name: 'Demo User',
    email: 'demo@jobtracker.test',
    password: 'Demo@123',
  },
  {
    label: 'Other account',
    name: 'Other User',
    email: 'other@jobtracker.test',
    password: 'Other@123',
  },
];
