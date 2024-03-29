const db = require('../helpers/db');
const {LIMIT_DATA} = process.env;

exports.createTransUser = (data,cb) =>{
  db.query('BEGIN', err=>{
    if(err){
      console.log(err);
      cb(err);}
    else{
      const queryUser = 'INSERT INTO users (username, email, password, pin) VALUES ($1, $2, $3, $4) RETURNING*';
      const valUser = [data.username, data.email, data.password, data.pin];
      db.query(queryUser,valUser,(err,res)=>{
        if(err){
          console.log(err);
          cb(err);}
        else{
          const queryProfile = 'INSERT INTO profile (user_id) VALUES ($1)';
          const valProfile = [res.rows[0].id];
          db.query(queryProfile,valProfile,(err,res)=>{
            if(err){
              console.log(err);
              cb(err);}else{
              cb(err,res);
              db.query('COMMIT',err=>{
                if (err)console.log(err);
              });
            }
          });
        }
      });
    }
  });
};

exports.createTransaction = (sender,data,cb)=>{
  const que = 'INSERT INTO transaction (sender_id,receiver_id,transfertype,amount,time_transfer,notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING*';
  const value = [sender,data.receiver,data.typeTransaction,data.amount,data.time,data.notes];
  db.query(que,value,(err,res)=>{
    if(res){
      cb(err,res);
    }else{
      cb(err);
    }
  });
}; 

exports.historyTransaction = (id,orderBy,order,limit=parseInt(LIMIT_DATA), offset=0,cb) => {
  const que = `SELECT transaction.id, transaction.sender_id, transaction.receiver_id, transaction.amount,transaction.transfertype, transaction.notes, transaction.time_transfer, sender.first_name, sender.profile_photo, sender.last_name,sender.user_id, receiver.first_name firstnamerec, receiver.last_name lastnamerec, receiver.profile_photo photorec, receiver.user_id useridrec FROM transaction FULL OUTER JOIN profile sender ON sender.user_id = transaction.sender_id FULL OUTER JOIN profile receiver ON receiver.user_id = transaction.receiver_id WHERE transaction.sender_id=${id} OR transaction.receiver_id=${id} ORDER BY ${orderBy} ${order} LIMIT $1 OFFSET $2`;
  const value = [limit,offset];
  db.query(que,value,(err,res)=>{
    if(res){
      cb(err,res);
    }else{
      cb(err);
    }
  });
};

exports.countHistory = (id, cb) =>{
  const que = `SELECT * FROM transaction WHERE receiver_id=${id} OR sender_id=${id}`;
  db.query(que,(err,res)=>{
    cb(err,res.rowCount);
  });
};

exports.transferToOthers = (id,data,cb) =>{
  db.query('BEGIN',err=>{
    if(err){
      cb(err);
    }else{
      const amount = parseInt(data.amount);
      data.typeTransaction = 'Transfer';
      db.query(`UPDATE profile SET balance = balance - ${amount} WHERE user_id=${id}`,err=>{
        if(err){
          cb(err);
        }else{
          const que = ('INSERT INTO transaction (sender_id,receiver_id,transfertype,amount,time_transfer,notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING*');
          const val = [id,data.receiver,data.typeTransaction,data.amount,data.time,data.notes];
          db.query(que,val,(err,result)=>{
            if (err) {
              cb(err);
            }else{
              cb(err,result);
              db.query(`UPDATE profile SET balance = balance + ${amount} WHERE user_id=${data.receiver}`,err=>{
                if(err){
                  cb(err);
                }db.query('COMMIT',err=>{
                  if (err) {
                    cb(err);
                  }
                });
              });
            }
          });
        }
      });
    }
  });
};

exports.topUp=(id,data,cb) =>{
  db.query('BEGIN',err=>{
    if(err){
      cb(err);
    }else{
      data.typeTransaction = 'Top Up';
      const amount = parseInt(data.amount);
      db.query(`UPDATE profile SET balance = balance + ${amount} WHERE user_id=${id}`,err=>{
        if(err){
          cb(err);
        }else{
          const que = ('INSERT INTO transaction (receiver_id,transfertype,amount,time_transfer,notes) VALUES ($1,$2,$3,$4,$5) RETURNING receiver_id,transfertype,amount,time_transfer,notes');
          const val = [id,data.typeTransaction,amount,data.time,data.notes];
          db.query(que,val,(err,result)=>{
            if(err){
              cb(err);
            }else{
              cb(err,result);
              db.query('COMMIT',err=>{
                if (err) {
                  cb(err);                  
                }
              });
            }
          });
        }
      });
    }
  });
};