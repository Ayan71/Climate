const Category = require('../models/Category');
const memoryStore = require('../config/store');
const mongoose = require('mongoose');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find().sort('name');
      return res.status(200).json({
        success: true,
        count: categories.length,
        categories,
      });
    }

    res.status(200).json({
      success: true,
      count: memoryStore.categories ? memoryStore.categories.length : 0,
      categories: memoryStore.categories || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (SuperAdmin)
exports.createCategory = async (req, res) => {
  try {
    const { name, domain, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Please provide category name' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const catObjectId = new mongoose.Types.ObjectId();
    const catIdStr = catObjectId.toString();

    const newCat = {
      _id: catIdStr,
      id: catIdStr,
      name,
      slug,
      domain: domain || 'General',
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!memoryStore.categories) memoryStore.categories = [];
    memoryStore.categories.push(newCat);

    if (mongoose.connection.readyState === 1) {
      await Category.create({
        ...newCat,
        _id: catObjectId,
      });
    }

    res.status(201).json({
      success: true,
      category: newCat,
      message: 'Category created successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (SuperAdmin)
exports.updateCategory = async (req, res) => {
  try {
    const { name, domain, description } = req.body;
    if (!memoryStore.categories) memoryStore.categories = [];

    const cat = memoryStore.categories.find(c => c._id === req.params.id || c.id === req.params.id);
    if (cat) {
      if (name) {
        cat.name = name;
        cat.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (domain) cat.domain = domain;
      if (description !== undefined) cat.description = description;
      cat.updatedAt = new Date();
    }

    if (mongoose.connection.readyState === 1) {
      let dbCat = await Category.findById(req.params.id);
      if (dbCat) {
        if (name) {
          dbCat.name = name;
          dbCat.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        if (domain) dbCat.domain = domain;
        if (description !== undefined) dbCat.description = description;
        await dbCat.save();
      }
    }

    res.status(200).json({
      success: true,
      category: cat,
      message: 'Category updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (SuperAdmin)
exports.deleteCategory = async (req, res) => {
  try {
    if (!memoryStore.categories) memoryStore.categories = [];
    const index = memoryStore.categories.findIndex(c => c._id === req.params.id || c.id === req.params.id);

    if (index !== -1) {
      memoryStore.categories.splice(index, 1);
    }

    if (mongoose.connection.readyState === 1) {
      await Category.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
