const Product = require('../models/Product');

// CREAR
exports.createProduct = async (req, res) => {
    try {
        // AHORA EXTRAEMOS LA CATEGORÍA DEL FRONTEND
        const { name, description, category, price, stock } = req.body;

        const newProduct = new Product({
            tenantId: req.tenant.tenantId,
            name,
            description,
            category: category || 'Food', // Añadimos la categoría
            price,
            stock: stock || 100
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto', details: error.message });
    }
};

// LEER TODOS
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ tenantId: req.tenant.tenantId });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos', details: error.message });
    }
};

// LEER UNO
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, tenantId: req.tenant.tenantId });
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
    }
};

// ACTUALIZAR
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenant.tenantId },
            req.body,
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
    }
};

// ELIMINAR
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, tenantId: req.tenant.tenantId });
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
    }
};