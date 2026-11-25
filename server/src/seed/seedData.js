const bcrypt = require('bcryptjs');
const db = require('../config/db');
const env = require('../config/env');
const User = require('../models/User');
const Application = require('../models/Application');

// A date relative to today keeps the demo data useful over time.
function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// Twelve fictional records for the demo account.
function demoApplications() {
  return [
    {
      jobTitle: 'Frontend Engineer',
      company: 'Northwind Labs',
      location: 'Austin, TX',
      employmentType: 'Full-time',
      postingUrl: 'https://example.com/jobs/northwind-frontend',
      dateApplied: daysFromNow(-4),
      status: 'Applied',
      contactName: 'Fictional Recruiter',
      contactEmail: 'recruiter@northwind.example',
      notes: 'Applied through the careers page.',
      followUpDate: daysFromNow(2)
    },
    {
      jobTitle: 'Backend Engineer',
      company: 'Acme Studio',
      location: 'Remote',
      employmentType: 'Contract',
      postingUrl: 'https://example.com/jobs/acme-backend',
      dateApplied: daysFromNow(-9),
      status: 'Interview',
      contactName: 'Demo Hiring Lead',
      contactEmail: 'hiring@acme.example',
      notes: 'Technical conversation scheduled.',
      followUpDate: daysFromNow(5),
      interviewDate: daysFromNow(3)
    },
    {
      jobTitle: 'Product Designer',
      company: 'Riverbright Co.',
      location: 'Denver, CO',
      employmentType: 'Full-time',
      postingUrl: 'https://example.com/jobs/riverbright-designer',
      dateApplied: daysFromNow(-2),
      status: 'Saved',
      notes: 'Portfolio needs a refresh before applying.',
      followUpDate: daysFromNow(7)
    },
    {
      jobTitle: 'Data Analyst', company: 'Northwind Labs', location: 'Austin, TX',
      dateApplied: daysFromNow(-12), status: 'Rejected', notes: 'Reached out for feedback.'
    },
    {
      jobTitle: 'QA Engineer', company: 'Acme Studio', location: 'Remote',
      employmentType: 'Part-time', dateApplied: daysFromNow(-6), status: 'Interview',
      interviewDate: daysFromNow(4), notes: 'Intro call with the team.'
    },
    {
      jobTitle: 'DevOps Engineer', company: 'Riverbright Co.', location: 'Chicago, IL',
      dateApplied: daysFromNow(-18), status: 'Offer', notes: 'Reviewing the offer details.'
    },
    {
      jobTitle: 'Mobile Developer', company: 'Lumen Works', location: 'Remote',
      employmentType: 'Internship', dateApplied: daysFromNow(-1), status: 'Saved',
      notes: 'Summer posting found through a mailing list.'
    },
    {
      jobTitle: 'Technical Writer', company: 'Northwind Labs', location: 'Austin, TX',
      employmentType: 'Temporary', dateApplied: daysFromNow(-22), status: 'Withdrawn'
    },
    {
      jobTitle: 'Engineering Manager', company: 'Acme Studio', location: 'Remote',
      dateApplied: daysFromNow(-30), status: 'Interview', followUpDate: daysFromNow(1),
      interviewDate: daysFromNow(6), notes: 'Second round interview pending.'
    },
    {
      jobTitle: 'Support Specialist', company: 'Riverbright Co.', location: 'Denver, CO',
      dateApplied: daysFromNow(-3), status: 'Applied', followUpDate: daysFromNow(3)
    },
    {
      jobTitle: 'UX Researcher', company: 'Lumen Works', location: 'Remote',
      dateApplied: daysFromNow(-15), status: 'Applied'
    },
    {
      jobTitle: 'Automation Engineer', company: 'Northwind Labs', location: 'Austin, TX',
      dateApplied: daysFromNow(-8), status: 'Saved', followUpDate: daysFromNow(9)
    }
  ];
}

// Two records for a second account, used to verify ownership rules.
function otherApplications() {
  return [
    {
      jobTitle: 'Staff Engineer',
      company: 'Beacon Works',
      location: 'Remote',
      dateApplied: daysFromNow(-5),
      status: 'Applied'
    },
    {
      jobTitle: 'Operations Lead',
      company: 'Riverbright Co.',
      location: 'Chicago, IL',
      dateApplied: daysFromNow(-10),
      status: 'Saved'
    }
  ];
}

// Find a user or create them with a hashed password.
async function ensureUser(name, email, plainPassword) {
  const existing = await User.findOne({ email: email });

  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);
  return User.create({ name: name, email: email, password: passwordHash });
}

// Insert only records that are not already present for this owner.
async function insertMissing(user, records) {
  let added = 0;

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    const existing = await Application.findOne({
      owner: user._id,
      jobTitle: record.jobTitle,
      company: record.company
    });

    if (!existing) {
      const newApplication = Object.assign({}, record, { owner: user._id });
      await Application.create(newApplication);
      added += 1;
    }
  }

  return added;
}

// Main seed routine. It is safe to run more than once.
async function seed() {
  try {
    await db.connect();

    const demo = await ensureUser('Demo User', env.seedUserEmail, env.seedUserPassword);
    const other = await ensureUser('Other User', env.seedOtherEmail, env.seedOtherPassword);

    let added = 0;
    added += await insertMissing(demo, demoApplications());
    added += await insertMissing(other, otherApplications());

    const userCount = await User.countDocuments({});
    const applicationCount = await Application.countDocuments({});

    console.log('Seed complete. Added this run:', added);
    console.log('Users:', userCount, 'Applications:', applicationCount);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    try {
      await db.disconnect();
    } catch (error) {
      console.error('Could not close MongoDB:', error.message);
    }
  }
}

seed();
