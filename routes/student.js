const express           = require('express')
const router            = express.Router()
const upload            = require('../middleware/upload')
const studentController = require('../controllers/students')
const { studentAuth ,getStudent} = require('../middleware/authenticate')
 

router.get('/user/1', studentAuth, getStudent,studentController.getStudDashboard)
router.get('/user/1/profile', studentAuth,getStudent, studentController.getProfile)
router.get('/user/1/updateProfile', studentAuth,getStudent, studentController.getUpdateProfile)
router.get('/user/1/dept/', studentAuth,getStudent, studentController.getDeptBooks)
router.get('/user/1/scheme/', studentAuth,getStudent, studentController.getSchemeBooks)
router.get('/user/1/help/', studentAuth,getStudent, studentController.getHelp)
router.get('/user/1/feedback/', studentAuth,getStudent, studentController.getFeedBack)
router.post('/user/1/feedback/', studentAuth,getStudent, studentController.postFeedBack)
router.get('/userLogout', studentController.getLogout)


router.post('/user/1/books/issue', studentAuth,getStudent, studentController.postIssueBook)
router.post('/user/1/notification', studentAuth,getStudent, studentController.postStudentNotifications)
router.post('/user/1/notification/read', studentAuth,getStudent, studentController.postSetRead)
router.post('/user/1/profile/bio', studentAuth,getStudent, studentController.postAddBio)
router.post('/user/1/updateProfile', studentAuth,getStudent, studentController.postUpdateStudent)
router.post('/user/1/updateImage',upload.single('stud_img'), studentController.postUpdateImage)



module.exports = router
