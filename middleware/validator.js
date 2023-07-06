const validator = require('validator');

const signupInputValidator = (name, email, password, phone) => {
  if (!email || !password || !phone || !name) {
    throw new Error('All fields must be filled');
  }
  if (!validator.isAlpha(name)) {
    throw new Error('Name must be in letters');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }
  if (!validator.isLength(password, { min: 6 })) {
    throw new Error('Weak password');
  }
};

const loginInputValidator = (email, password) => {
  if (!email || !password) {
    throw new Error('All fields must be filled');
  }
};

module.exports = { signupInputValidator, loginInputValidator };
