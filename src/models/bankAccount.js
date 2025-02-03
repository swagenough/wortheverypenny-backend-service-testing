import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bankAccountSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountType: { type: String, required: true },
    balance: { type: Number, required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    createdAt: { type: Date, default: Date.now }
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
export default BankAccount;