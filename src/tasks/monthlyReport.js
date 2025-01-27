import cron from 'node-cron';
import User from '../models/user.js';
import MonthlyReport from '../models/monthlyReport.js';

async function createMonthlyReport(userId, totalIncome, totalExpense, spendingCategories, recommendations) {
    try {
        const user = await User.findById(userId);
        const newReport = new MonthlyReport({
            user: userId,
            totalIncome,
            totalExpense,
            spendingCategories,
            recommendations,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        });

        user.monthlyReport.unshift(newReport._id);
        await newReport.save();
        await user.save();
        console.log("Monthly report created successfully!");
        
    } catch(e) {
        console.log(e);
    }
}

async function generateMonthlyReports() {
    try {
        const users = await User.find(); 
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        for (const user of users) {
            const existingReport = await MonthlyReport.findOne({
                user: user._id,
                month: currentMonth,
                year: currentYear
            });

            if (!existingReport) {
                const totalIncome = 0; 
                const totalExpense = 0;
                const spendingCategories = [];
                const recommendations = [];

                await createMonthlyReport(user._id, totalIncome, totalExpense, spendingCategories, recommendations);
            }
        }
        console.log("Monthly reports generated successfully!");
    } catch (error) {
        console.log(error);
    }
}

cron.schedule('0 0 1 * *', () => {
    console.log('Generating monthly reports...');
    generateMonthlyReports();
});

export { generateMonthlyReports, createMonthlyReport };
