// import { Schema, model } from 'mongoose'
const mongoose = require('mongoose')

// Define Schemes
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ex) 홍길동
  position: { type: String, required: true }, // ex) 관리
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true }
  // admin: { type: Boolean }
})

// Create Model & Export
module.exports = mongoose.model('User', userSchema)
// es6 문법 적용 시 mongoose가 이해를 못하는지 export default로 불가능
