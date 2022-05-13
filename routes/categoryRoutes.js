const express = require('express');
const router = express.Router();
const { createCategory, deleteCategory, getCategories, getCategory, updateCategory } = require('../controllers/categoryControllers');
const { requireSignin, requireAdmin } = require('../middleware/authCheck');



router.post('/createcategory', requireSignin, requireAdmin, createCategory);
router.delete('/deletecategory/:categoryId', requireSignin, requireAdmin, deleteCategory);
router.get('/getcategories', getCategories);
router.get('/getcategory/:categoryId', getCategory);
router.put('/updatecategory/:categoryId', requireSignin, requireAdmin, updateCategory);


module.exports = router;