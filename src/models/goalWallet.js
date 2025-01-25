import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const goalWalletSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    goalName: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    targetDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
} , { collection: 'goalWallets' });

const GoalWallet = mongoose.model('GoalWallet', goalWalletSchema);
export default GoalWallet;