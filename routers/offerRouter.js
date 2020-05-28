const express = require('express');

const offerController = require('./../controllers/offerController');

const router = express.Router({
    mergeParams: true
});

router.route('/')
    .get(offerController.getAllOffers)
    .post(offerController.createNewOffer);

router.route('/:id')
    .get(offerController.getOffer)
    .patch(offerController.updateOffer)
    .delete(offerController.deleteOffer);

module.exports = router;