const Application = require('../models/Application');
const apiResponse = require('../utils/apiResponse');
const csv = require('../utils/csv');

// Build the where-clause. Owner is always included so users only see their own rows.
function buildFilter(req) {
  const filter = { owner: req.user._id };
  const search = req.query.search;
  if (search) {
    filter.$or = [
      { jobTitle: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.employmentType) {
    filter.employmentType = req.query.employmentType;
  }
  if (req.query.from || req.query.to) {
    filter.dateApplied = {};
    if (req.query.from) {
      filter.dateApplied.$gte = new Date(req.query.from);
    }
    if (req.query.to) {
      const endDate = new Date(req.query.to);
      endDate.setHours(23, 59, 59, 999);
      filter.dateApplied.$lte = endDate;
    }
  }
  return filter;
}

// Only the three allowed sort fields can reach Mongoose.
function buildSort(req) {
  const direction = req.query.order === 'asc' ? 1 : -1;
  const field = req.query.sort || 'dateApplied';
  if (field === 'company') {
    return { company: direction };
  }
  if (field === 'jobTitle') {
    return { jobTitle: direction };
  }
  return { dateApplied: direction };
}

// Midnight today, used by the two "upcoming" lists in stats.
function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

// GET /api/applications
async function list(req, res, next) {
  try {
    const filter = buildFilter(req);
    const page = req.query.page || 1;
    const askedLimit = req.query.limit || 10;
    const limit = Math.min(askedLimit, 50);
    const skip = (page - 1) * limit;
    const total = await Application.countDocuments(filter);
    const items = await Application.find(filter).sort(buildSort(req)).skip(skip).limit(limit);
    const pages = Math.ceil(total / limit);
    return apiResponse.list(res, { items: items, page: page, pages: pages, total: total });
  } catch (error) {
    return next(error);
  }
}

// GET /api/applications/stats (registered before /:id in the router)
async function stats(req, res, next) {
  try {
    const owner = req.user._id;
    const data = {
      total: await Application.countDocuments({ owner: owner }),
      byStatus: {
        Saved: await Application.countDocuments({ owner: owner, status: 'Saved' }),
        Applied: await Application.countDocuments({ owner: owner, status: 'Applied' }),
        Interview: await Application.countDocuments({ owner: owner, status: 'Interview' }),
        Offer: await Application.countDocuments({ owner: owner, status: 'Offer' }),
        Rejected: await Application.countDocuments({ owner: owner, status: 'Rejected' }),
        Withdrawn: await Application.countDocuments({ owner: owner, status: 'Withdrawn' })
      }
    };
    const today = startOfToday();
    data.upcomingFollowUps = await Application.find({ owner: owner, followUpDate: { $gte: today } })
      .sort({ followUpDate: 1 }).limit(5);
    data.upcomingInterviews = await Application.find({ owner: owner, interviewDate: { $gte: today } })
      .sort({ interviewDate: 1 }).limit(5);
    return apiResponse.success(res, 200, 'Statistics fetched.', data);
  } catch (error) {
    return next(error);
  }
}

// GET /api/applications/export
async function exportCsv(req, res, next) {
  try {
    const filter = buildFilter(req);
    const items = await Application.find(filter).sort(buildSort(req));
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="applications.csv"');
    return res.status(200).send(csv.toCsv(items));
  } catch (error) {
    return next(error);
  }
}

// GET /api/applications/:id
async function getById(req, res, next) {
  try {
    const application = await Application.findOne({ _id: req.params.id, owner: req.user._id });
    if (!application) {
      return apiResponse.error(res, 404, 'Application not found.');
    }
    return apiResponse.success(res, 200, 'Application fetched.', { application: application });
  } catch (error) {
    return next(error);
  }
}

// POST /api/applications
async function create(req, res, next) {
  try {
    const application = await Application.create({
      owner: req.user._id,
      jobTitle: req.body.jobTitle,
      company: req.body.company,
      location: req.body.location,
      employmentType: req.body.employmentType,
      postingUrl: req.body.postingUrl,
      dateApplied: req.body.dateApplied,
      status: req.body.status,
      contactName: req.body.contactName,
      contactEmail: req.body.contactEmail,
      notes: req.body.notes,
      followUpDate: req.body.followUpDate,
      interviewDate: req.body.interviewDate
    });
    return apiResponse.success(res, 201, 'Application created.', { application: application });
  } catch (error) {
    return next(error);
  }
}

// PUT /api/applications/:id
async function update(req, res, next) {
  try {
    const application = await Application.findOne({ _id: req.params.id, owner: req.user._id });
    if (!application) {
      return apiResponse.error(res, 404, 'Application not found.');
    }
    if (req.body.jobTitle !== undefined) application.jobTitle = req.body.jobTitle;
    if (req.body.company !== undefined) application.company = req.body.company;
    if (req.body.location !== undefined) application.location = req.body.location;
    if (req.body.employmentType !== undefined) application.employmentType = req.body.employmentType;
    if (req.body.postingUrl !== undefined) application.postingUrl = req.body.postingUrl;
    if (req.body.dateApplied !== undefined) application.dateApplied = req.body.dateApplied;
    if (req.body.status !== undefined) application.status = req.body.status;
    if (req.body.contactName !== undefined) application.contactName = req.body.contactName;
    if (req.body.contactEmail !== undefined) application.contactEmail = req.body.contactEmail;
    if (req.body.notes !== undefined) application.notes = req.body.notes;
    if (req.body.followUpDate !== undefined) application.followUpDate = req.body.followUpDate;
    if (req.body.interviewDate !== undefined) application.interviewDate = req.body.interviewDate;
    await application.save();
    return apiResponse.success(res, 200, 'Application updated.', { application: application });
  } catch (error) {
    return next(error);
  }
}

// DELETE /api/applications/:id
async function remove(req, res, next) {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!application) {
      return apiResponse.error(res, 404, 'Application not found.');
    }
    return apiResponse.success(res, 200, 'Application deleted.', {});
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, stats, exportCsv, getById, create, update, remove };
