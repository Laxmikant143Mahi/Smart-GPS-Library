const express          = require('express')
const router           = express.Router()
const studentController = require('../controllers/students')
const authController   = require('../controllers/AuthController')
const { loginAuth , studentLoginAuth}    = require('../middleware/authenticate')

// Landing page
router.get('/',authController.getLandingPage)

// Admin login handler
router.get("/auth/admin-login",loginAuth,authController.getAdminLoginPage);
router.post("/auth/admin-login", authController.postAdminLogin);
router.get("/auth/admin-signup", authController.getAdminSignupPage);
router.post("/auth/admin-signup", authController.postAdminSignup);

// HOD Login
router.get("/auth/hod-login",authController.getHodLoginPage);
router.get("/auth/hod-signup",authController.getHodSignUpPage);
router.post("/auth/hod-login",authController.postHodLogin);
router.post("/auth/hod-signup",authController.postHodSignup);

// Student login handler
router.get("/auth/user-login", studentLoginAuth, authController.getUserLoginPage);
router.post("/auth/user-login" ,authController.postUserLoginPage);

router.get("/auth/user-signup", authController.getUserSignUp);
router.post("/auth/user-signup", authController.postUserSignUp);
router.post('/feedback', studentController.postLandingFeedBack)

module.exports = router 
