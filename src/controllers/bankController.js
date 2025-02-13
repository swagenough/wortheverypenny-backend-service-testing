import BankAccount from "../models/bankAccount.js";
import User from "../models/user.js";

const addNewBankAccount = async (req, res) => {
    try {
        const { bankName, accountNumber, accountType, balance, createdAt } = req.body;
        console.log("bankName", bankName);  
        console.log(req.body);

        // Check for duplicate account number
        const existingAccount = await BankAccount.findOne({ accountNumber });
        if (existingAccount) {
            return res.status(400).json({ msg: 'Account number already exists' });
        }

        const userOwner = await User.findById(req.id);
        if (!userOwner) {
            console.log('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }

        const newBankAccount = new BankAccount({
            user: req.id,
            bankName,
            accountNumber,
            accountType,
            balance, 
            createdAt
        });
        await newBankAccount.save();
        userOwner.bankAccount.unshift(newBankAccount._id);
        await userOwner.save();
        res.status(200).json({data: newBankAccount});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { addNewBankAccount };