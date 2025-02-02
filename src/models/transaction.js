import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true, default: Date.now },
    name: { type: String, required: true },
    amount : { type: Number, required: true },
    tags: [{ type: String }],
    type: { type: String, enum: ['income', 'expense'], required: true },
    description: { type: String },
    category: { type: String },
    recurring: { type: Boolean, default: false },
    currency: { type: String, default: 'Rp' },
    source: { type: String },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'transactions' });

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;