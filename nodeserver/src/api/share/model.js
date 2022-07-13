import mongoose, { Schema } from 'mongoose'

const shareSchema = new Schema({
  amount: Number,
  cost: String,
  date: Date,
  company: {
    type: String,
    ref: 'Company',
    index: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    index: true
  }
}, {
  timestamps: true
})


shareSchema.methods = {
  view(full) {
    let view = {}
    view.user = this.user;
    view.company = this.company;
    view.amount = this.amount
    view.price = this.price
    view.date = this.date
    view.id = this.id

    if (full) {
      view.createdAt = this.createdAt;
      view.updatedAt = this.updatedAt;
    }

    return view;
  }
}

const model = mongoose.model('Share', shareSchema)
export const schema = model.schema
export default model