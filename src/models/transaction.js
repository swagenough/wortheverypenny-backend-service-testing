import mongoose from "mongoose";
import moment from 'moment-timezone';
const Schema = mongoose.Schema;

moment.tz.setDefault('Asia/Jakarta');

const TransactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true, default: () => moment().toDate() },
    name: { type: String, required: true },
    amount : { type: Number, required: true },
    tags: [{ type: String }],
    type: { type: String, enum: ['income', 'expense'], required: true },
    description: { type: String },
    category: { type: String },
    recurring: { type: Boolean, default: false },
    recurrenceInterval: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: null },
    nextOccurrence: { type: Date },
    currency: { type: String, default: 'Rp' },
    source: { type: String },
    createdAt: { type: Date, default: () => moment().toDate() },
}, { collection: 'transactions' });

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;