const express = require('express');
const router = express.Router();
const invCtrl = require('../controllers/inventoryController');

router.post('/products', invCtrl.createProductAndInventory);
router.get('/inventories', invCtrl.getAllInventories);
router.get('/inventories/:id', invCtrl.getInventoryById);
router.post('/inventories/add-stock', invCtrl.addStock);
router.post('/inventories/remove-stock', invCtrl.removeStock);
router.post('/inventories/reservation', invCtrl.reserveStock);
router.post('/inventories/sold', invCtrl.sellStock);

module.exports = router;