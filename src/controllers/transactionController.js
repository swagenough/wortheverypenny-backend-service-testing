import Transaction from '../models/transaction.js';
import MonthlyReport from '../models/monthlyReport.js';
import BankAccount from '../models/bankAccount.js';
import User from '../models/user.js';
import mongoose from 'mongoose'
import { calculateNextOccurrence } from '../tasks/recurringTransaction.js';

const addTransaction = async (req, res) => {
    try {
        const { amount, name, source, tags, date, category, recurring, recurrenceInterval, description, type, createdAt } = req.body;

        const userOwner = await User.findById(req.id);
        if (!userOwner) {
            console.log('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }

        const transactionDate = new Date(date);

        const newTransaction = new Transaction({
            user: req.id,
            amount,
            name,
            source,
            tags,
            date: transactionDate,
            category,
            recurring,
            recurrenceInterval: recurring ? recurrenceInterval : null,
            nextOccurrence: recurring ? calculateNextOccurrence(recurrenceInterval, transactionDate) : null,
            description,
            type,
            createdAt: new Date(createdAt),
        });
        await newTransaction.save();

        userOwner.transactions.unshift(newTransaction._id);
        if (source === 'cash') {
            userOwner.cash += type === 'income' ? amount : -amount;
        } else {
            const bankAccount = await BankAccount.findOne({ user: req.id, accountNumber: source });
            if (bankAccount) {
                bankAccount.balance += type === 'income' ? amount : -amount;
                await bankAccount.save();
            }
        }

        const monthlyReport = await MonthlyReport.findOne({ user: req.id, month: new Date().getMonth() + 1, year: new Date().getFullYear() });

        if (!monthlyReport) {
            const newMonthlyReport = new MonthlyReport({
                user: req.id,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                totalIncome: 0,
                totalExpense: 0
            });
            await newMonthlyReport.save();
            userOwner.monthlyReport.unshift(newMonthlyReport._id);
        }

        if (type === 'income') {
            monthlyReport.totalIncome += amount;
        } else {
            monthlyReport.totalExpense += amount;
        }

        await monthlyReport.save();
        await userOwner.save();
        res.status(200).json(newTransaction);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const getCategorizedTransactions = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.id); // Correctly create ObjectId instance

        const transactions = await Transaction.aggregate([
            { $match: { user: userId } }, // Filter by user ID
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: "%Y-%m", date: "$date" } },
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    },
                    transactions: { $push: "$$ROOT" }
                }
            },
            {
                $group: {
                    _id: "$_id.month",
                    days: {
                        $push: {
                            day: "$_id.day",
                            transactions: "$transactions"
                        }
                    }
                }
            },
            {
                $sort: { "_id": -1 } // Sort by month in descending order
            }
        ]);

        res.status(200).json({data: transactions});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
    
export default {
    addTransaction, 
    getCategorizedTransactions
}