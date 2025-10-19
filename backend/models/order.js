import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    isPaid: { type: Boolean, default: false },
    totalPrice: { type: Number },
    paymentMethod: { type: String },
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;