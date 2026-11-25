const { body, query, param, validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];
const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];
const SORTS = ['dateApplied', 'company', 'jobTitle'];
const ORDERS = ['asc', 'desc'];

// Rules for POST /api/auth/register.
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required.').escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail()
    .escape(),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
];

// Rules for POST /api/auth/login.
const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail()
    .escape(),
  body('password').notEmpty().withMessage('Password is required.')
];

// Shared application field rules, used by the create route.
const applicationRules = [
  body('jobTitle').trim().notEmpty().withMessage('Job title is required.').escape(),
  body('company').trim().notEmpty().withMessage('Company is required.').escape(),
  body('location').optional({ checkFalsy: true }).trim().escape(),
  body('employmentType')
    .optional({ checkFalsy: true })
    .isIn(EMPLOYMENT_TYPES)
    .withMessage('Invalid employment type.'),
  body('postingUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Posting URL must be a valid URL.')
    .escape(),
  body('dateApplied')
    .isISO8601()
    .withMessage('Date applied must be a valid ISO date.')
    .toDate(),
  body('status').optional({ checkFalsy: true }).isIn(STATUSES).withMessage('Invalid status.'),
  body('contactName').optional({ checkFalsy: true }).trim().escape(),
  body('contactEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Contact email must be a valid email address.')
    .escape(),
  body('notes').optional({ checkFalsy: true }).trim().escape(),
  body('followUpDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Follow-up date must be a valid ISO date.')
    .toDate(),
  body('interviewDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Interview date must be a valid ISO date.')
    .toDate()
];

// On update every field is optional, but each one is still checked.
const updateRules = [
  body('jobTitle').optional().trim().notEmpty().withMessage('Job title cannot be empty.').escape(),
  body('company').optional().trim().notEmpty().withMessage('Company cannot be empty.').escape(),
  body('location').optional().trim().escape(),
  body('employmentType')
    .optional()
    .isIn(EMPLOYMENT_TYPES)
    .withMessage('Invalid employment type.'),
  body('postingUrl').optional().trim().isURL().withMessage('Posting URL must be a valid URL.').escape(),
  body('dateApplied').optional().isISO8601().withMessage('Date applied must be a valid ISO date.').toDate(),
  body('status').optional().isIn(STATUSES).withMessage('Invalid status.'),
  body('contactName').optional().trim().escape(),
  body('contactEmail').optional().isEmail().withMessage('Contact email must be valid.').escape(),
  body('notes').optional().trim().escape(),
  body('followUpDate').optional().isISO8601().withMessage('Follow-up date must be valid.').toDate(),
  body('interviewDate').optional().isISO8601().withMessage('Interview date must be valid.').toDate()
];

// Query strings used by both the list and the CSV export.
const queryRules = [
  query('search').optional({ checkFalsy: true }).trim().escape(),
  query('status').optional({ checkFalsy: true }).isIn(STATUSES).withMessage('Invalid status.'),
  query('employmentType')
    .optional({ checkFalsy: true })
    .isIn(EMPLOYMENT_TYPES)
    .withMessage('Invalid employment type.'),
  query('from').optional({ checkFalsy: true }).isISO8601().withMessage('From date must be a valid ISO date.'),
  query('to').optional({ checkFalsy: true }).isISO8601().withMessage('To date must be a valid ISO date.'),
  query('sort').optional({ checkFalsy: true }).isIn(SORTS).withMessage('Invalid sort field.'),
  query('order').optional({ checkFalsy: true }).isIn(ORDERS).withMessage('Order must be asc or desc.'),
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer.')
    .toInt(),
  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50.')
    .toInt()
];

const idRule = [param('id').isMongoId().withMessage('Invalid application id.')];

// Return a 400 response when any rule above fails.
function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return apiResponse.error(res, 400, 'Validation failed.', errors.array({ onlyFirstError: true }));
}

module.exports = {
  registerRules,
  loginRules,
  applicationRules,
  updateRules,
  queryRules,
  idRule,
  validateRequest
};
