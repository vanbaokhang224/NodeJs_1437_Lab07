const express = require('express');
const mongoose = require('mongoose');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
app.use(express.json());

// Kết nối MongoDB (Đổi URI phù hợp với máy của bạn)
mongoose.connect('mongodb://localhost:27017/inventory_db')
    .then(() => console.log("✅ Đã kết nối MongoDB"))
    .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

app.use('/api', inventoryRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));