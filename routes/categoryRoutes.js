const express = require('express');
const router = express.Router();
const { createCategory, deleteCategory, getCategories, getCategory, updateCategory } = require('../controllers/categoryControllers');



router.post('/createcategory', createCategory);
router.delete('/deletecategory/:categoryId', deleteCategory);
router.get('/getcategories', getCategories);
router.get('/getcategory/:categoryId', getCategory);
router.put('/updatecategory/:categoryId', updateCategory);


module.exports = router;