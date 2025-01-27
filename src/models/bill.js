import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const billSchema = new Schema({
    totalAmount: { type: Number, required: true },
    splitDetails: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            amount: { type: Number, required: true },
        }
    ], 
    description: { type: String },
    proofOfBillPayment: { type: String },
    paidPercentage: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'bills' }); 

const Bill = mongoose.model('Bill', billSchema);
export default Bill;