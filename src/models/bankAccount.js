import mongoose from "mongoose";
import moment from 'moment-timezone';
const Schema = mongoose.Schema;

moment.tz.setDefault('Asia/Jakarta');

const bankAccountSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountType: { type: String, required: true },
    balance: { type: Number, required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    createdAt: { type: Date, default: () => moment().toDate() },
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
export default BankAccount;