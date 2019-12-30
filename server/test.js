// const accountSid = 'AC699135a39630eef9c93531ece5a14239';
// const authToken = '3f44a4c50b511c1be8f15c0e799b92a8';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//       .create({
//          body: 'McAvoy or Stewart? These timelines can get so confusing.',
//          from: '+12012926522',
//          statusCallback: 'http://postb.in/1234abcd',
//          to: '+918219431886'
//        })
//       .then(message => console.log(message.sid));

var speakeasy = require('speakeasy');
var secret = speakeasy.generateSecret({length:20});
var token = speakeasy.totp({
    secret : secret.base32,
    encoding : 'base32'
});


var secretBase32 = secret.base32;
//verifying a given token 
var tokenValidates = speakeasy.totp.verify({
    secret:secretBase32,
    encoding:'base32',
    token: token
    // window : 6
});

console.log(token , secret.base32,tokenValidates);



// var x = require('mymodule');
// // var y = new x();
// // x();
// x.myFunction();
// console.log(x);