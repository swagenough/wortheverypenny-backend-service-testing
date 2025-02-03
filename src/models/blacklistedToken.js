import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const blacklistedTokenSchema = new Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { collection: 'blacklistedTokens' });

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
export default BlacklistedToken;