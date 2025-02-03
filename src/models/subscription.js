import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    plan: { type: String, default: 'Basic' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { collection: 'subscriptions' });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;