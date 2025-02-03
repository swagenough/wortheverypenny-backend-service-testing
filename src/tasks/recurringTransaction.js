import cron from 'node-cron';
import Transaction from '../models/transaction.js';

const recurringTransaction = async () => {
    try {
        const recurringTransactions = await Transaction.find({ recurring: true });
        for (const transaction of recurringTransactions) {
            if (new Date() >= new Date(transaction.nextOccurrence)) {
                const newTransaction = new Transaction({
                    user: transaction.user,
                    date: new Date(),
                    name: transaction.name,
                    amount: transaction.amount,
                    tags: transaction.tags,
                    type: transaction.type,
                    description: transaction.description,
                    category: transaction.category,
                    recurring: transaction.recurring,
                    recurrenceInterval: transaction.recurrenceInterval,
                    nextOccurrence: calculateNextOccurrence(transaction.recurrenceInterval, transaction.nextOccurrence),
                    currency: transaction.currency,
                    source: transaction.source,
                });

                await newTransaction.save();

                transaction.nextOccurrence = newTransaction.nextOccurrence;
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
        default:
            throw new Error('Invalid recurrence interval');
    }
    return date;
}

cron.schedule('0 0 * * *', () => {
    console.log('STARTED Recurring transactions...');
    recurringTransaction();
});

export { recurringTransaction, calculateNextOccurrence };