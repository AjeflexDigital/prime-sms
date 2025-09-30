// hash.js
const bcrypt = require('bcrypt');

(async () => {
  const password = "newadmin123"; // change if you want
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  console.log("Plain:", password);
  console.log("Hash:", hash);
})();
// INSERT INTO users (email, password, role, status, credits, email_verified)
VALUES (
  'superadmin@smsplatform.com',
  '$2b$12$WxoyKYDAQgEPPnbeKV3mX.lNO0I/Ww9ZjCG6Crj3g5LfOjnmqOfK',
  'admin',
  'active',
  10000.00,
  TRUE
);
