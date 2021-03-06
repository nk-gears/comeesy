const validator = require('validator');

const nameRegEx = new RegExp('^[a-zA-Z,öÖåÅäÄøØ ]{2,50}$');
const passwordRegEx = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$');

exports.validateLoginData = data => {
  const errors = {};

  if (validator.isEmpty(data.email)) errors.email = 'Must not be empty';
  else if (!validator.isEmail(data.email))
    errors.email = 'Must be a valid email address';
  if (validator.isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    isValid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateSignupData = data => {
  let errors = {};
  if (validator.isEmpty(data.name)) errors.name = 'Must not be empty';
  else if (!nameRegEx.test(data.name))
    errors.name = 'Please use your authentic name';

  if (validator.isEmpty(data.username)) errors.username = 'Must not be empty';

  if (validator.isEmpty(data.email)) errors.email = 'Must not be empty';
  else if (!validator.isEmail(data.email))
    errors.email = 'Must be a valid email address';

  errors = { ...errors, ...this.validatePasswordContent(data).errors };
  return {
    errors,
    isValid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateBodyContent = (content, maxLength) => {
  let error = '';
  if (typeof content === 'string' && validator.isEmpty(content))
    error = 'Must not be empty';
  if (typeof content === 'string' && maxLength && content.length > maxLength)
    error = `You have exceeded the maximum character limit of ${maxLength}`;
  else if (Array.isArray(content) && content.length === 0)
    error = 'Must not be empty';
  else if (typeof content === 'object' && Object.keys(content).length === 0)
    error = 'Invalid data';

  return {
    error,
    isValid: error === '' ? true : false,
  };
};

exports.validateImageFile = (file, size, mimetype) => {
  const maxFileSizeAllowed = 2097152; // 2Mb
  const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  let error = '';

  if (!file) error = 'Upload failed. Invalid image file.';
  else if (file && !acceptedFileTypes.includes(mimetype))
    error =
      'Upload failed. Image must be one of the following types: jpeg, jpg or png';
  if (file && size - 100 >= maxFileSizeAllowed)
    error = 'Upload failed. Image size must not exceed 2MB';

  return {
    error,
    isValid: error === '' ? true : false,
  };
};

// validate name
exports.validName = name => {
  console.log(name);
  return !validator.isEmpty(name) && nameRegEx.test(name);
};

// validate email address
exports.validEmail = email => {
  return !validator.isEmpty(email) && validator.isEmail(email);
};

exports.validatePasswordContent = data => {
  const errors = {};

  if (data.password !== undefined && validator.isEmpty(data.password))
    errors.password = 'Must not be empty';
  if (data.password !== undefined && !passwordRegEx.test(data.password))
    errors.password = 'Password strength must meet the requirements';

  if (
    data.confirmPassword !== undefined &&
    validator.isEmpty(data.confirmPassword)
  )
    errors.confirmPassword = 'Must not be empty';

  if (!validator.equals(data.password, data.confirmPassword))
    errors.confirmPassword = 'Must match the password';

  return {
    errors,
    isValid: Object.keys(errors).length === 0 ? true : false,
  };
};
