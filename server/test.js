// const accountSid = 'AC9ab6ab6ae85229e1cd50a09b2874e080';
// const authToken = 'b131438367faec917c87474af2aa0c84';
// // const accountSid = 'ACc2e3c52e5706de976a4bbca08cb13fd9';
// // const authToken = '765da1baa37d9bb82407e8bc62ca4129';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//       .create({
//          body: 'McAvoy or Stewart? These timelines can get so confusing.',
//          from: '+13343199864',
//          to: '+918219431886'
//        })
//       .then(message => console.log(message.sid));

// var speakeasy = require('speakeasy');
// var secret = speakeasy.generateSecret({length:20});
// var token = speakeasy.totp({
//     secret : secret.base32,
//     encoding : 'base32'
// });

// //verifying a given token 
// var tokenValidates = speakeasy.totp.verify({
//     secret:secret.base32,
//     encoding:'base32',
//     token: token,
//     window : 6
// });

// console.log(token , secret.base32);



// var x = require('mymodule');
// // var y = new x();
// // x();
// x.myFunction();
// console.log(x);