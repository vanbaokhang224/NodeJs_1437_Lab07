const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// 1. Mỗi khi tạo product thì sẽ tạo 1 inventory tương ứng
exports.createProductAndInventory = async (req, res) => {
    try {
        const { name, price } = req.body;
        
        // Tạo product
        const newProduct = await Product.create({ name, price });

        // Tạo inventory tương ứng
        const newInventory = await Inventory.create({
            product: newProduct._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });

        res.status(201).json({
            message: "Tạo sản phẩm và kho thành công!",
            product: newProduct,
            inventory: newInventory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get all (có join với product)
exports.getAllInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get inventory by ID (có join với product)
exports.getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) return res.status(404).json({ message: "Không tìm thấy kho!" });
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Add_stock: Tăng stock
exports.addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOneAndUpdate(
            { product },
            { $inc: { stock: quantity } },
            { new: true }
        );
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Remove_stock: Giảm stock
exports.removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        
        // Kiểm tra xem stock có đủ để giảm không (để tránh bị âm)
        const inv = await Inventory.findOne({ product });
        if (!inv || inv.stock < quantity) {
            return res.status(400).json({ message: "Không đủ tồn kho để giảm!" });
        }

        const inventory = await Inventory.findOneAndUpdate(
            { product },
            { $inc: { stock: -quantity } },
            { new: true }
        );
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Reservation: Giảm stock và tăng reserved
exports.reserveStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inv = await Inventory.findOne({ product });
        if (!inv || inv.stock < quantity) {
            return res.status(400).json({ message: "Không đủ tồn kho để đặt trước (reserve)!" });
        }

        const inventory = await Inventory.findOneAndUpdate(
            { product },
            { $inc: { stock: -quantity, reserved: quantity } },
            { new: true }
        );
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Sold: Giảm reservation và tăng soldCount
exports.sellStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inv = await Inventory.findOne({ product });
        if (!inv || inv.reserved < quantity) {
            return res.status(400).json({ message: "Không đủ hàng đặt trước (reserved) để chuyển sang bán!" });
        }

        const inventory = await Inventory.findOneAndUpdate(
            { product },
            { $inc: { reserved: -quantity, soldCount: quantity } },
            { new: true }
        );
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};