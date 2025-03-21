import mongoose from 'mongoose';

const paymentDetailSchema = new mongoose.Schema({
    userId: String,
    email: { type: String, required: true },
    amount: Number,
    payment_id: { type: String, required: true },
    productName: { type: String, required: true },
    type: { type: String, enum: ["Regular", "SIP"]},
    createdAt: Date
}, { timestamps: true });

export const PaymentDetail = mongoose.models.PaymentDetail || mongoose.model("PaymentDetail", paymentDetailSchema);