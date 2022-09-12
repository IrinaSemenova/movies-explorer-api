const router = require('express').Router();
const { updateUserValidate } = require('../middlewares/validator');

const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getUserInfo);
router.patch('/users/me', updateUserValidate, updateUser);

module.exports = router;
