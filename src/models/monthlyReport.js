import mongoose from 'mongoose';
import moment from 'moment-timezone';
const Schema = mongoose.Schema; 

moment.tz.setDefault('Asia/Jakarta');

const monthlyReportSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    totalIncome: { type: Number, required: true },
    totalExpense: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    spendingCategories: [
        {
            category: { type: String, required: true },
            amount: { type: Number, required: true },
        }
    ],
    recommendations: [{ type: String }],
    createdAt: { type: Date, default: () => moment().toDate() },
}, { collection: 'monthlyReports' }); 

const MonthlyReport = mongoose.model('MonthlyReport', monthlyReportSchema);
export default MonthlyReport;