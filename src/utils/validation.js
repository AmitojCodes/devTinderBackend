const validator = require("validator");

const validation = (req) => {
  const { password, emailId, firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter valid name");
  } else if (firstName.length < 5 || firstName.length > 50) {
    throw new Error("Not valid name");
  } else if (
    !validator.isEmail(emailId) ||
    !validator.isStrongPassword(password)
  ) {
    throw new Error("Enter strong password or use correct emailId");
  }
};

module.exports = { validation };
