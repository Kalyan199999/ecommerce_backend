const Product = require('../models/Product');
const User = require('../models/User')

const addNewProduct =  async (req, res) => {
  
  try 
  {
    const { title, description, price, category, stock, adminId } = req.body;
    const imagePaths = req.files.map(file => file); // or `file.path` for full paths

    const user = await User.findById(adminId);

    const createdBy = user._id
    
    const product = new Product({
      title,
      description,
      price,
      category,
      stock,
      createdBy,
      images: imagePaths
    });

    await product.save();

    return res.status(201).json({message: 'Product created successfully', product });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Product creation failed' });
  }
}

const getProducts = async (req, res) => {
  try 
  {
    const products = await Product.find();
    return res.status(201).json({message: 'Products fetched successfully', products});
  } 
  catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try 
  {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    return res.json(product);
  } 
  catch (err) 
  {
    return res.status(500).json({ error: err.message });
  }
};

// GET all the admin products
const getAdminProducts = async (req, res) => {
  
  try {
    const adminId = req.params.adminId;

    const admin = await User.findById(adminId);
    const products = await Product.find({ createdBy: admin._id });

    res.status(201).json({ message: 'Admin products fetched successfully', products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin products' });
  }
};


const updateProduct = async (req, res) => {
  try {
    
    const { title, description, price, category, stock } = req.body;
    const imagePaths = req.files.map(file => file);

    const updatedFields = {
      title,
      description,
      price,
      category,
      stock,
    };

    if (imagePaths.length > 0) {
      updatedFields.images = imagePaths;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ msg: 'Product not found' });

    res.status(200).json({ msg: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};


const deleteProduct = async (req, res) => {
  try 
  {
    const item = await Product.findByIdAndDelete(req.params.id);
    return res.json({ msg: 'Product deleted' , item });
  } 
  catch (err) 
  {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
    addNewProduct,
    getProducts, 
    getProductById, 
    deleteProduct,
    updateProduct,
    getAdminProducts
}