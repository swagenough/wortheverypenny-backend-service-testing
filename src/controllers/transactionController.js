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
                $sort: { "_id.day": -1 } // Sort by day in descending order within each month
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

const getDailyAmountTransactions = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.id);

        const firstTransaction = await Transaction.findOne({ user: userId }).sort({ date: 1 });
        const lastTransaction = await Transaction.findOne({ user: userId }).sort({ date: -1 });

        if (!firstTransaction || !lastTransaction) {
            return res.status(404).json({ msg: 'No transactions found for the user' });
        }

        const startDate = new Date(firstTransaction.date);
        const endDate = new Date(lastTransaction.date);

        const transactions = await Transaction.aggregate([
            { 
                $match: { 
                    user: userId,
                    date: { $gte: startDate, $lte: endDate }
                } 
            },
            {
                $group: {
                    _id: {
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    },
                    totalAmount: { $sum: "$amount" },
                    totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                    totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
                }
            },
            {
                $sort: { "_id.day": 1 } 
            }
        ]);

        const transactionMap = new Map();
        transactions.forEach(transaction => {
            transactionMap.set(transaction._id.day, transaction);
        });

        const allDays = [];
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const dayString = d.toISOString().split('T')[0];
            if (transactionMap.has(dayString)) {
                allDays.push(transactionMap.get(dayString));
            } else {
                allDays.push({
                    _id: { day: dayString },
                    totalAmount: 0,
                    totalIncome: 0,
                    totalExpense: 0
                });
            }
        }

        res.status(200).json({ data: allDays });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
    
export default {
    addTransaction, 
    getCategorizedTransactions, 
    getDailyAmountTransactions
}