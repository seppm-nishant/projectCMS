const express = require('express');
const router = express.Router();
const entitiesController = require('../controllers/entities');

router.post('/', entitiesController.createEntity);
router.get('/:entityName', entitiesController.getEntityData);
router.post('/:entityName', entitiesController.createEntry);
router.put('/:entityName/:id', entitiesController.updateEntry);
router.delete('/:entityName/:id', entitiesController.deleteEntry);

module.exports = router;
