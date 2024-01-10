/**
 * Created by CTT VNPAY
 */

const express = require('express');
const Transaction = require('../models/transactionModel');
const authController = require('../controllers/authController');

const router = express.Router();
// const $ = require('jquery');
// const request = require('request');
const moment = require('moment');
const axios = require('axios');
// const crypto = require('crypto');

function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

router.get('/', (req, res, next) => {
  res.render('orderlist', { title: 'Danh sách đơn hàng' });
});

router.get('/create_payment_url', (req, res, next) => {
  res.render('order', { title: 'Tạo mới đơn hàng', amount: 10000 });
});

router.get('/querydr', (req, res, next) => {
  const desc = 'truy van ket qua thanh toan';
  res.render('querydr', { title: 'Truy vấn kết quả thanh toán' });
});

router.get('/refund', (req, res, next) => {
  const desc = 'Hoan tien GD thanh toan';
  res.render('refund', { title: 'Hoàn tiền giao dịch thanh toán' });
});

router.post(
  '/create_payment_url',
  authController.protect,
  async (req, res, next) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    // const config = require('config');
    const transaction = await Transaction.create({ user: req.user.id });

    const tmnCode = 'Q3OF5JFS';
    const secretKey = 'FKGMAVRWCHRERUOEYLQOXKVSMNCQYLZA';
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = `https://mushy-gray-sari.cyclic.app/api/v1/payment/vnpay_return`;
    const orderId = transaction.id;
    // const orderId = moment(date).format('DDHHmmss');
    const amount = 10000;
    const bankCode = null;

    let locale = 'vn';
    if (locale === null || locale === '') {
      locale = 'vn';
    }
    const currCode = 'VND';
    let vnpParams = {};
    vnpParams.vnp_Version = '2.1.0';
    vnpParams.vnp_Command = 'pay';
    vnpParams.vnp_TmnCode = tmnCode;
    vnpParams.vnp_Locale = locale;
    vnpParams.vnp_CurrCode = currCode;
    vnpParams.vnp_TxnRef = orderId;
    vnpParams.vnp_OrderInfo = `Nang cap VIP`;
    vnpParams.vnp_OrderType = 'other';
    vnpParams.vnp_Amount = 10000 * 100;
    vnpParams.vnp_ReturnUrl = returnUrl;
    vnpParams.vnp_IpAddr = ipAddr;
    vnpParams.vnp_CreateDate = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnpParams.vnp_BankCode = bankCode;
    }

    vnpParams = sortObject(vnpParams);

    const querystring = require('qs');
    const signData = querystring.stringify(vnpParams, { encode: false });
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnpParams.vnp_SecureHash = signed;
    vnpUrl += `?${querystring.stringify(vnpParams, { encode: false })}`;

    res.status(200).json({
      status: 'success',
      url: vnpUrl,
    });
  }
);

router.get('/vnpay_return', async (req, res, next) => {
  let vnpParams = req.query;

  const secureHash = vnpParams.vnp_SecureHash;

  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  vnpParams = sortObject(vnpParams);

  // const config = require('config');
  const tmnCode = 'Q3OF5JFS';
  const secretKey = 'FKGMAVRWCHRERUOEYLQOXKVSMNCQYLZA';

  const querystring = require('qs');
  const signData = querystring.stringify(vnpParams, { encode: false });
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  vnpParams.vnp_Amount /= 100;

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    const transaction = await Transaction.findByIdAndUpdate(
      vnpParams.vnp_TxnRef,
      vnpParams,
      {
        new: true,
        runValidators: true,
      }
    );
    const user = await User.findByIdAndUpdate(
      transaction.user,
      { role: 'vip' },
      {
        new: true,
        runValidators: true,
      }
    );
    // res.status(200).json({
    //   status: 'success',
    //   data: transaction,
    // });
  } else {
    const transaction = await Transaction.findByIdAndUpdate(
      vnpParams.vnp_TxnRef,
      vnpParams,
      {
        new: true,
        runValidators: true,
      }
    );
    // res.status(200).json({
    //   status: 'success',
    //   code: '97',
    // });
  }

  res.redirect(`http://www.delfpratice.id.vn/dashboard/payment`);
});

router.get('/vnpay_ipn', async (req, res, next) => {
  let vnpParams = req.query;
  const secureHash = vnpParams.vnp_SecureHash;

  const orderId = vnpParams.vnp_TxnRef;
  const rspCode = vnpParams.vnp_ResponseCode;

  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  vnpParams = sortObject(vnpParams);
  // const config = require('config');
  const secretKey = 'FKGMAVRWCHRERUOEYLQOXKVSMNCQYLZA';
  const querystring = require('qs');
  const signData = querystring.stringify(vnpParams, { encode: false });
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  const paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  const checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  const checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus === '0') {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode === '00') {
            //thanh cong
            // paymentStatus = '1';
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            res.status(200).json({ RspCode: '00', Message: 'Success' });
          } else {
            //that bai
            // paymentStatus = '2';
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.status(200).json({ RspCode: '99', Message: 'Success' });
          }
        } else {
          res.status(200).json({
            RspCode: '02',
            Message: 'This order has been updated to the payment status',
          });
        }
      } else {
        res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
      }
    } else {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }
});
//
// router.post('/querydr', (req, res, next) => {
//   process.env.TZ = 'Asia/Ho_Chi_Minh';
//   const date = new Date();
//
//   const config = require('config');
//   const crypto = require('crypto');
//
//   const vnp_TmnCode = config.get('vnp_TmnCode');
//   const secretKey = config.get('vnp_HashSecret');
//   const vnp_Api = config.get('vnp_Api');
//
//   const vnp_TxnRef = req.body.orderId;
//   const vnp_TransactionDate = req.body.transDate;
//
//   const vnp_RequestId = moment(date).format('HHmmss');
//   const vnp_Version = '2.1.0';
//   const vnp_Command = 'querydr';
//   const vnp_OrderInfo = `Truy van GD ma:${vnp_TxnRef}`;
//
//   const vnp_IpAddr =
//     req.headers['x-forwarded-for'] ||
//     req.connection.remoteAddress ||
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress;
//
//   const currCode = 'VND';
//   const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
//
//   const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
//
//   const hmac = crypto.createHmac('sha512', secretKey);
//   const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');
//
//   const dataObj = {
//     vnp_RequestId: vnp_RequestId,
//     vnp_Version: vnp_Version,
//     vnp_Command: vnp_Command,
//     vnp_TmnCode: vnp_TmnCode,
//     vnp_TxnRef: vnp_TxnRef,
//     vnp_OrderInfo: vnp_OrderInfo,
//     vnp_TransactionDate: vnp_TransactionDate,
//     vnp_CreateDate: vnp_CreateDate,
//     vnp_IpAddr: vnp_IpAddr,
//     vnp_SecureHash: vnp_SecureHash,
//   };
//   // /merchant_webapi/api/transaction
//   request(
//     {
//       url: vnp_Api,
//       method: 'POST',
//       json: true,
//       body: dataObj,
//     },
//     (error, response, body) => {
//       console.log(response);
//     }
//   );
// });
//
router.post('/refund', authController.protect, async (req, res, next) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const date = new Date();

  const crypto = require('crypto');

  const vnpTmnCode = 'Q3OF5JFS';
  const secretKey = 'FKGMAVRWCHRERUOEYLQOXKVSMNCQYLZA';
  const vnpApi = 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';

  const vnpTxnRef = req.body.id;
  const vnpTransactionDate = req.body.transDate;
  const vnpAmount = req.body.amount * 100;
  const vnpTransactionType = req.body.transType;
  const vnpCreateBy = req.user.id;

  const currCode = 'VND';

  const vnpRequestId = moment(date).format('HHmmss');
  const vnpVersion = '2.1.0';
  const vnpCommand = 'refund';
  const vnpOrderInfo = `Hoan tien GD ma:${vnpTxnRef}`;

  const vnpIpAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const vnpCreateDate = moment(date).format('YYYYMMDDHHmmss');

  const vnpTransactionNo = '0';

  const data = `${vnpRequestId}|${vnpVersion}|${vnpCommand}|${vnpTmnCode}|${vnpTransactionType}|${vnpTxnRef}|${vnpAmount}|${vnpTransactionNo}|${vnpTransactionDate}|${vnpCreateBy}|${vnpCreateDate}|${vnpIpAddr}|${vnpOrderInfo}`;
  const hmac = crypto.createHmac('sha512', secretKey);
  const vnpSecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');

  const dataObj = {
    vnp_RequestId: vnpRequestId,
    vnp_Version: vnpVersion,
    vnp_Command: vnpCommand,
    vnp_TmnCode: vnpTmnCode,
    vnp_TransactionType: vnpTransactionType,
    vnp_TxnRef: vnpTxnRef,
    vnp_Amount: vnpAmount,
    vnp_TransactionNo: vnpTransactionNo,
    vnp_CreateBy: vnpCreateBy,
    vnp_OrderInfo: vnpOrderInfo,
    vnp_TransactionDate: vnpTransactionDate,
    vnp_CreateDate: vnpCreateDate,
    vnp_IpAddr: vnpIpAddr,
    vnp_SecureHash: vnpSecureHash,
  };

  const response = await axios.post(vnpApi, dataObj);
  const responseCode = response.data.vnp_ResponseCode;

  if (responseCode === '00') {
    console.log('Success');

    res.status(200).json({
      status: 'success',
      message: response.data.vnp_Message,
    });
  } else {
    console.log(response.data.vnp_Message);

    res.status(200).json({
      status: 'failed',
      message: response.data.vnp_Message,
    });
  }
});

module.exports = router;
