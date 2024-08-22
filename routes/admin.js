const express         = require('express')
const router          = express.Router()
const adminController = require('../controllers/admin')
const upload          = require('../middleware/upload')
const uploadP         = require('../middleware/uploadProfiles')
const {requireAuth , getCurrentUser ,getCurrentHod ,requireHodAuth} = require('../middleware/authenticate')

router.get('/admin', requireAuth,getCurrentUser,adminController.getDashboard)
router.post('/admin', requireAuth,getCurrentUser,adminController.postNotifications)
router.get('/adminLogout', adminController.getLogout)

router.get('/admin/books/add', requireAuth,getCurrentUser, adminController.getAddbook)
router.get('/admin/books/return', requireAuth,getCurrentUser, adminController.getReturnBook)
router.post('/admin/books/add',upload.single('book_img'), adminController.postAddBook)

router.get('/admin/books/update', requireAuth,getCurrentUser, adminController.getUpdatebook)
router.post('/admin/books/update', requireAuth,getCurrentUser, adminController.postUpdateBook)
router.get('/admin/books/show', requireAuth, getCurrentUser,adminController.getShowbooks)
router.get('/admin/books/issuedBooks', requireAuth, getCurrentUser,adminController.getIssuedBook)
router.post('/admin/books/issuedBooks', getCurrentUser,adminController.postIssuedBook)
router.post('/admin/issueBookAccepted', requireAuth, getCurrentUser,adminController.postIssueAccept)
router.post('/admin/issueBookRejected', requireAuth, getCurrentUser,adminController.issueBookRejected)
router.get('/admin/defaulter-list', requireAuth, getCurrentUser,adminController.getDefaulterList)

// Student Routes
router.get('/admin/students/add', requireAuth,getCurrentUser, adminController.getAddStudent)
router.post('/admin/students/add',uploadP.single('stud_img'), adminController.postAddStudent)
router.get('/admin/students/update', requireAuth, getCurrentUser,adminController.getUpdateStudent)
// Admin -> Update Student
router.post('/admin/students/update', requireAuth, getCurrentUser,adminController.postUpdateStudent)
router.get('/admin/students/show', requireAuth,getCurrentUser, adminController.getAllStudents)

// Table filtering Routes
router.post('/admin/books/show', requireAuth, getCurrentUser,adminController.postShowBooks)
router.post('/admin/books/status', requireAuth,adminController.postShowByStatus)
router.post('/admin/students/status', requireAuth,adminController.postStudentByStatus)
router.post('/admin/students/enrollment', requireAuth,adminController.postStudentByEnrollment)
router.post('/admin/books/search', requireAuth,adminController.getSuggestions)
router.post('/admin/addScheme', requireAuth,adminController.addbookScheme)
router.post('/admin/addDepartment', requireAuth,adminController.addDepartment)
router.post('/admin/books/search/scheme', requireAuth,adminController.postShowByScheme)
router.post('/admin/books/search/department', requireAuth,adminController.postShowByDepartment)
router.post('/admin/student/search/department', requireAuth,adminController.postStudByDepartment)

// popup data display routes
router.post('/admin/getIssueData',adminController.getIssueData)
router.post('/admin/getBookData',adminController.getBookData)
router.post('/admin/getStudentData', requireAuth,adminController.postStudentData)

router.post('/admin/getIssuedBook', requireAuth,adminController.postIssuedBooks)
router.post('/admin/returnBook', requireAuth,adminController.postReturnBook)

// HOD ROUTES
router.get('/gps/hod',requireHodAuth, getCurrentHod,adminController.getHodDashboard)
router.get('/hodLogout', adminController.getHodLogout)

module.exports = router
