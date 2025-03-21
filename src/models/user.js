import mongoose from 'mongoose';
import moment from 'moment-timezone';
const Schema = mongoose.Schema;

moment.tz.setDefault('Asia/Jakarta');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 5 },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: (value) => {
                const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                return value.match(re)
            }, 
            message: 'Please enter a valid email address'
        },
        trim: true
    },
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    password: { type: String, required: true, minlength: 6 },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    displayName: { type: String, minlength: 5, default: function() { return this.username; } },
    bills: [{ type: Schema.Types.ObjectId, ref: 'Bill' }],
    paymentNumber: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    cash: { type: Number, default: 0 },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    bankAccount: [{ type: Schema.Types.ObjectId, ref: 'BankAccount' }],
    debts: { type: Number, default: 0 },
    monthlyReport: [{ type: Schema.Types.ObjectId, ref: 'MonthlyReport' }],
    language: { type: String, default: 'id' },
    currency: { type: String, default: 'IDR' },
    savings: { type: Number, default: 0 },
    createdAt: { type: Date, default:  () => moment().toDate() },
    updatedAt: { type: Date, default: () => moment().toDate() },
    timeZone: { type: String, default: 'Asia/Jakarta' },
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);
export default User;