const router = require('express').Router();
const applicationController = require('../controllers/application.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Every application route needs a logged-in user.
router.use(auth.protect);

// Keep /stats and /export above /:id so the word is not read as an id.
router.get('/', validate.queryRules, validate.validateRequest, applicationController.list);
router.get('/stats', applicationController.stats);
router.get('/export', validate.queryRules, validate.validateRequest, applicationController.exportCsv);

router.get('/:id', validate.idRule, validate.validateRequest, applicationController.getById);
router.post('/', validate.applicationRules, validate.validateRequest, applicationController.create);
router.put(
  '/:id',
  validate.idRule.concat(validate.updateRules),
  validate.validateRequest,
  applicationController.update
);
router.delete('/:id', validate.idRule, validate.validateRequest, applicationController.remove);

module.exports = router;
