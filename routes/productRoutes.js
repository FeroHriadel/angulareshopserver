const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, getProductCount, getFeaturedProducts, getProductsByCategory, uploadProductGallery } = require('../controllers/productControllers');
const { requireSignin, requireAdmin } = require('../middleware/authCheck');



//MULTER
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid Image Type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}` )
    }
});

const uploadOptions = multer({storage: storage});



router.post('/createproduct', requireSignin, requireAdmin, uploadOptions.single('image'), createProduct);
router.put('/uploadproductgallery/:productId', requireSignin, requireAdmin, uploadOptions.array('images', 10), uploadProductGallery);
router.get('/getproducts', getProducts);
router.get('/getproduct/:productId', getProduct);
router.put('/updateproduct/:productId', requireSignin, requireAdmin, uploadOptions.single('image'), updateProduct);
router.delete('/deleteproduct/:productId', requireSignin, requireAdmin, deleteProduct);
router.get('/getproductcount', getProductCount);
router.get('/getfeaturedproducts/:count', getFeaturedProducts);
router.get('/getproductsbycategory', getProductsByCategory);



module.exports = router;