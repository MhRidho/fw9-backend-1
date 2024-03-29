# Backend STD iWallet RESTFull API

##  Description
Backend aplication for service STD iWallet, this aplication is made using Node.js and Express.Js

## Built With
![Node](https://img.shields.io/badge/Node-v14.19.3-green?style=flat)
![Express](https://img.shields.io/badge/Express-v4.18.1-blue?style=flat)

## Requirements
1. NodeJs
2. Postman
3. Posgree SQL
4. DB management
5. Clodinary

## Run App
1. Clone this Repositories
2. Type `npm install` in tour terminal
3. Set up your ENV
4. Open Postman
5. You can follow end point <a href="https://www.getpostman.com/collections/8b1ba1d109bcfdd22309" target="_blank">here</a>
6. You also can access app in https://backend-stdiwallet.vercel.app/

## Set Up ENV
```
PORT={your-port}
DATABASE_URL={your-db}
LIMIT_DATA={number}
MAX_SIZE={photo-size-in-mb}
APP_KEY={your-secret-key}
CLOUDINARY_URL={your-cludinary-url}
```

## Table of EndPoint
|url|method|desc|
|---|------|----|
|/auth/register|POST|register new user|
|/auth/login|POST|login user|
|/auth/createPin|POST|create pin user|
|/profile|GET|to get profile|
|/profile|PATCH|edit profile user include edit photo|
|/number|POST|to add number phone|
|/number|PATCH|to edit number phone|
|/topUp|PATCH|to top up balance user|
|/transfer|POST|to transfer between 2 user|
|/historyTransaction|GET|get history transaction user|
|/changePin|PATCH|to change pin user|
|/changePassword|PATCH|to change password user|


