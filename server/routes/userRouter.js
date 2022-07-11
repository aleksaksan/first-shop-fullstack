const Router = require('express');
const router = new Router();
const userRouter = require('../controllers/userController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/registration', userRouter.registration);
router.post('/login', userRouter.login);
router.get('/auth', authMiddleware, userRouter.check);

module.exports = router;
