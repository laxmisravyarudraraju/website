const express = require('express');
const likeController = require('./../controllers/likeController');
const authController = require('./../controllers/authController');

const router = express.Router({
    mergeParams: true
});

router.use(authController.grantAccess);

router.route('/')
    .get(likeController.getAllLikes)
    .post(likeController.createNewLike)
    .delete(likeController.deleteLike);

router.route('/:id')
    .get(likeController.getLike)
    .delete(likeController.deleteLike);

module.exports = router;