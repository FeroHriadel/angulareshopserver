const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, getProductCount, getFeaturedProducts, getProductsByCategory } = require('../controllers/productControllers');



router.post('/createproduct', createProduct);
router.get('/getproducts', getProducts);
router.get('/getproduct/:productId', getProduct);
router.put('/updateproduct/:productId', updateProduct);
router.delete('/deleteproduct/:productId', deleteProduct);
router.get('/getproductcount', getProductCount);
router.get('/getfeaturedproducts/:count', getFeaturedProducts);
router.get('/getproductsbycategory', getProductsByCategory);



module.exports = router;