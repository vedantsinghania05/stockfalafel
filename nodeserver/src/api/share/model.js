import mongoose, { Schema } from 'mongoose'

const shareSchema = new Schema({
  ticker: {
    type: String
  },
  amount: {
    type: Number
  },
  date: {
    type: Date
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
  view (full) {
    let view = {}
    view.user = this.user;
    view.ticker = this.ticker;
    view.amount = this.amount
    view.date = this.date
 
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