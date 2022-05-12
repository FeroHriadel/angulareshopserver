const Category = require('../models/categoryModel');



exports.createCategory = async (req, res) => {
    try {
        const { name, icon, color  } = req.body;
        if (!name) return res.status(400).json({error: 'Name is required'});

        let category = new Category({name, icon, color});
        category = await category.save();
        if (!category) return res.status(500).json({error: 'Category cannot be created'});

        res.status(201).json({category});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        Category.findByIdAndRemove(categoryId)
            .then(category => {
                if (category) return res.json({message: 'Category deleted'})
                else return res.status(404).json({error: 'Category not found'})
            })
            .catch(err => {
                return res.status(500).json({error: 'Category deletion failed'});
            });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories) return res.status(404).json({error: 'No categories found'});

        res.json({categories});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) return res.status(404).json({error: 'Categoryu not found'});
        
        res.json({category});
        
    } catch (error) {
       console.log(error);
       res.status(500).json({error: 'Server error'}); 
    }
}



exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, icon, color } = req.body;
        if (!name || !icon || !color) return res.status(400).json({error: 'name, icon, and color are required'});

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {name, icon, color}, {new: true});
        if (!updatedCategory) return res.status(500).json({error: 'Category update failed'});

        res.json({category: updatedCategory});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'}); 
    }
}