import cron from 'node-cron';
import Transaction from '../models/transaction.js';
import User from '../models/user.js';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Jakarta');

const recurringTransaction = async () => {
    try {
        const recurringTransactions = await Transaction.find({ recurring: true });
        for (const transaction of recurringTransactions) {
            if (moment().isSameOrAfter(moment(transaction.nextOccurrence))) {
                
                const newTransaction = new Transaction({
                    user: transaction.user,
                    date: moment().tz('Asia/Jakarta').toDate(),
                    name: transaction.name,
                    amount: transaction.amount,
                    tags: transaction.tags,
                    type: transaction.type,
                    description: transaction.description,
                    category: transaction.category,
                    recurring: false,
                    recurrenceInterval: transaction.recurrenceInterval,
                    nextOccurrence: null,
                    currency: transaction.currency,
                    source: transaction.source,
                });
                await newTransaction.save();

                console.log({
                    msg: `Recurring Transaction (${transaction.recurrenceInterval})`,
                    moment_time: moment(),
                    transaction_time: moment(transaction.nextOccurrence),
                    newTransaction
                })

                const userOwner = await User.findById(transaction.user);
                userOwner.transactions.unshift(newTransaction._id);
                await userOwner.save();
                
                const newNextOccurrence = calculateNextOccurrence(transaction.recurrenceInterval, transaction.nextOccurrence);
                transaction.nextOccurrence = newNextOccurrence;
                await transaction.save();
            }
        }
    } catch (error) {
        console.log("Error in recurringTransaction", error);
    }
}

function calculateNextOccurrence(interval, currentDate) {
    const date = new Date(currentDate);
    switch (interval) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
        case '30-seconds':
            date.setSeconds(date.getSeconds() + 30);
            break;
        default:
            throw new Error('Invalid recurrence interval');
    }
    return moment(date).tz('Asia/Jakarta').toDate();
}

cron.schedule('*/15 * * * * *', () => {
    console.log('STARTED Recurring transactions...');
    recurringTransaction();
});

export { recurringTransaction, calculateNextOccurrence };