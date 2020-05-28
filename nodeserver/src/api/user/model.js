import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import { env } from '../../config'

const userSchema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  /* istanbul ignore next */
  const rounds = env === 'test' ? 1 : 9

  bcrypt.hash(this.password, rounds).then((hash) => {
    this.password = hash
    next()
  }).catch(next)
})

userSchema.methods = {
  view (full) {
    let view = {}

    view.id = this.id;
    view.email = this.email;
 
    if (full) {
      view.createdAt = this.createdAt;
      view.updatedAt = this.updatedAt;
    }     

    return view;
  },

  authenticate (password) {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
  }
}

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
