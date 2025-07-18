import Product from '../models/productModel.js';

const createProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user token' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Product images are required.' });
    }
    
    const { name, price, description, category, subCategory, countInStock, isOnSale } = req.body;

    // --- START: THIS IS THE FIX ---
    // The path should start with /uploads/, not /backend/uploads/
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    // --- END: THIS IS THE FIX ---

    const mainImage = imagePaths[0];
    const galleryImages = imagePaths.slice(1);

    const product = new Product({
      name,
      price,
      user: req.user._id,
      image: mainImage,
      gallery: galleryImages, // This will now be populated correctly for products with >1 image
      category,
      subCategory,
      countInStock,
      description,
      isOnSale: isOnSale === 'true',
    });

    const createdProduct = await product.save();
    res.status(200).json(createdProduct);
  } catch (error) {
    console.error('ERROR IN createProduct:', error);
    res.status(500).json({ message: 'Server error while creating product.' });
  }
};

const updateProduct = async (req, res) => {
  const { name, price, description, category, subCategory, countInStock, isOnSale } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.subCategory = subCategory;
    product.countInStock = countInStock;
    product.isOnSale = isOnSale;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
};

const getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isOnSale: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ 
      category: new RegExp(`^${req.params.categoryName}$`, 'i') 
    });
      res.json(products);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const getHomepageProducts = async (req, res) => {
  try {
    const men = await Product.find({ category: 'Men' }).sort({ createdAt: -1 }).limit(5);
    const women = await Product.find({ category: 'Women' }).sort({ createdAt: -1 }).limit(5);
    const children = await Product.find({ category: 'Children' }).sort({ createdAt: -1 }).limit(5);
    const sale = await Product.find({ category: 'Sale' }).sort({ createdAt: -1 }).limit(5);

    res.json({ men, women, children, sale });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

export { getProducts, getProductById, createProduct, getHomepageProducts, getProductsByCategory, updateProduct, deleteProduct, getSaleProducts };