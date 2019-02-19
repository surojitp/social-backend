const validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateLoginInput(data){
  let errors = {};
  console.log(isEmpty(data.name));
  
  
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  

  if(!validator.isEmail(data.email)){
    errors.email = "Not a valid Email!";
  }

  if(validator.isEmpty(data.email)){
    errors.email = "Email field is required!";
  }


  if(validator.isEmpty(data.password)){
    errors.password = "password field is required!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}