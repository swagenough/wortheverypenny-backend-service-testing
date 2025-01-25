import mongoose from 'mongoose';
const Schema = mongoose.Schema; 

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
    createdAt: { type: Date, default: Date.now },
}, { collection: 'monthlyReports' }); 

const MonthlyReport = mongoose.model('MonthlyReport', monthlyReportSchema);
export default MonthlyReport;