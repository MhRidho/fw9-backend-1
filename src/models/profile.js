const db = require('../helpers/db');
const {LIMIT_DATA} = process.env;

exports.ListProfileModels = (tabel, keyword,method,limit=parseInt(LIMIT_DATA), offset=0,cb) => {
  const que = `SELECT * FROM profile WHERE ${tabel} LIKE '%${keyword}%' ORDER BY id ${method} LIMIT $1 OFFSET $2`;
  const value = [limit,offset];
  db.query(que,value,(err,res)=>{
    cb(err,res);
  });
};

exports.countProfileListModels = (tabel, keyword, cb) =>{
  const que = `SELECT * FROM profile WHERE ${tabel} LIKE '%${keyword}%'`;
  db.query(que,(err,res)=>{
    cb(err,res.rowCount);
  });
};

exports.createProfileModels = (data, cb) =>{
  const que = 'INSERT INTO profile (first_name, last_name, profile_photo, num_phone, balance, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*';
  const value = [data.first_name, data.last_name, data.profile_photo, data.num_phone, data.balance, data.user_id];
  db.query(que,value,(err, res)=>{
    if(res){
      cb(err, res.rows);
    }else{
      cb(err);
    }
  });
};

exports.editProfileModels = (id, data, cb) =>{
  const que = 'UPDATE profile SET first_name=$1, last_name=$2, profile_photo=$3, num_phone=$4, balance=$5, user_id=$6 WHERE id=$7 RETURNING*';
  const value = [data.first_name, data.last_name, data.profile_photo, data.num_phone, data.balance, data.user_id, id];
  db.query(que,value,(err, res)=>{
    if(res){
      cb(err, res);
    }else{
      cb(err);

    }
  });
};

exports.deleteProfile = (id, cb) =>{
  const que = 'DELETE FROM profile WHERE id=$1 RETURNING*';
  const value = [id];
  db.query(que,value,(err,res)=>{
    cb(err,res);
  });
};