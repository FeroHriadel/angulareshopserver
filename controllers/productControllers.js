const Product = require('../models/productModel');
const Category = require('../models/categoryModel');



exports.createProduct = async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).json({error: 'Bad category'});

        const file = req.file;
        if (!file) return res.status(400).json({error: 'Image is required'});
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        });

        product = await product.save();
        if (!product) return res.status(500).json({error: 'Saving product failed'});

        res.status(201).json({product});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.uploadProductGallery = async (req, res) => {
    try {
        const files = req.files;
        if (!files) return res.status(400).json({error: 'Images are required'});

        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        const imagesPaths = [];
        files.map(file => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });

        const productId = req.params.productId;
        const updatedProduct = await Product.findByIdAndUpdate(productId, {images: imagesPaths}, {new: true});
        if (!updatedProduct) return res.status(500).json({error: 'Gallery upload failed'});

        res.json({product: updatedProduct});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        if (!products) return res.status(404).json({error: 'No products found'});

        res.json({products});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate('category');
        if (!product) return res.status(404).json({error: 'Product not found'});
        res.json({product});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.updateProduct = async (req, res) => {
    try {
        //check category
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).json({error: 'Bad Category'});

        //get product
        const { productId } = req.params;
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({error: 'Product not found'});

        //check for image
        const file = req.file;
        let imagepath;

        if (file) {
            const fileName = file.fielname;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagepath = `${basePath}${fileName}`;
        } else {
            imagepath = product.image;
        }

        //update product
        let updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imagepath,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            }, 
            {new: true});
        if (!updatedProduct) return res.status(500).json({error: 'Product update failed'});
        
        res.json({product: updatedProduct});
        
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Server error'});  
    }
}



exports.deleteProduct = async (req, res) => {
    try {
        Product.findByIdAndRemove(req.params.productId)
            .then(product => {
                if (product) return res.json({message: 'Product deleted'});
                else return res.status(404).json({error: 'Product not found'});
            })
            .catch(err => {
                return res.status(500).json({error: 'Product deletion failed'});
            });
            
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'}); 
    }
}



exports.getProductCount = async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        if (!productCount) return res.status(500).json({error: 'Counting failed'});

        res.json({productCount});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'}); 
    }
}



exports.getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({isFeatured: true}).limit(req.params.count || 0)
        if (!featuredProducts) return res.status(500).json({error: 'Counting failed'});

        return res.json({featuredProducts});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'}); 
    }
}



exports.getProductsByCategory = async (req, res) => {
    try {
        let filter = {};
        if (req.query.categories) {
            filter = {category: req.query.categories.split(',')}; //[9dj9ee9, d099kde, 0eomkc9, ...]
        }
        const products = await Product.find(filter);
        if (!products) return res.status(404).json({error: 'No categories found'});

        res.json({products});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'}); 
    }
}