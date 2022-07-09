const userModels = require('../models/users');
const response = require('../helpers/standarResponse');
const errorResponse = require('../helpers/errorResponse');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = (req,res) => {
  req.body.pin=null;
  userModels.createUserModels(req.body,(err)=>{
    if(err){
      return errorResponse(err,res);
    }
    return response(res,'Create Success');
  });
};

exports.createPin = (req,res) =>{
  const {email} = req.body;
  userModels.getUserByEmail(email,(err,result)=>{
    if(err){
      return errorResponse(err,res);
    }
    if(result.rowCount>0){
      const user = result.rows[0];
      if(user.pin === null){
        userModels.editUserModels(user.id,{pin: req.body.pin},(err,resultUpdate)=>{
          if(err){
            return errorResponse(err,res);
          }
          const userUpdate = resultUpdate.rows[0];
          if(userUpdate.email===user.email){
            return response(res,'Pin Created');
          }
        });
      }else{
        return response(res,'Error: Pin already set');
      }
    }else{
      return response(res, 'Email not Found', null, null, 400);
    }
  });
};

exports.login = (req, res) => {
  const {email, password} = req.body;
  userModels.getUserByEmail(email,(err,result)=>{
    if(err){
      return errorResponse(err,res);
    }
    if(result.rowCount<1){
      return response(res,'Email or Password is wrong');
    }
    const user = result.rows[0];
    bcrypt.compare(password,user.password)
      .then((comp)=>{
        if(comp){
          const token = jwt.sign({id: user.id},process.env.APP_KEY||'secret');
          return response(res,'Login Succes', null, token);
        }
        return response(res,'Email or Password is wrong');
      })
      .catch(()=>{
        return response(res,'Email or Password is wrong');
      });
  });
};