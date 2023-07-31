const mongoose = require('mongoose');
const User = require('./userModel');

const transactionSchema = new mongoose.Schema({
  vnp_Amount: Number,
  vnp_BankCode: String,
  vnp_BankTranNo: String,
  vnp_CardType: String,
  vnp_OrderInfo: String,
  vnp_PayDate: String,
  vnp_ResponseCode: String,
  vnp_TmnCode: String,
  vnp_TransactionNo: String,
  vnp_TransactionStatus: String,
  vnp_TxnRef: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

transactionSchema.post(/^find/, async doc => {
  if (doc.vnp_ResponseCode === '00') {
    await User.findByIdAndUpdate(doc.user, { role: 'vip' });
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
