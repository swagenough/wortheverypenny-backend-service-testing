import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    plan: { type: Schema.Types.ObjectId, enum: ['Basic', 'Premium'], required: true, default: 'Basic' },
    subscriptionStatus: { type: String, enum: ['Active', 'Inactive'], required: true, default: 'Active' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { collection: 'subscriptions' });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;