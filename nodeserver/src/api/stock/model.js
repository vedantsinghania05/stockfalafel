import mongoose, { Schema } from 'mongoose'

const stockSchema = new Schema({
  ticker: {
    type: String
  },
 /* company: {
    type: Schema.ObjectId,
    ref: "Company",
    index: true
  },*/
  date: {
    type: Date
  },
  open: {
    type: Number
  },
  high: {
    type: Number
  },
  low: {
    type: Number
  },
  close: {
    type: Number
  },
  volume: {
    type: Number
  }
}, {
  timestamps: true
})

stockSchema.methods = {
  view (full) {
    let view = {}
    view.ticker  = this.ticker;
    view.date  = this.date;
    view.open  = this.open;
    view.high  = this.high;
    view.low  = this.low;
    view.close  = this.close;
    view.volume  = this.volume;

    if (full) {
      view.createdAt = this.createdAt;
      view.updatedAt = this.updatedAt;
    }     

    return view;
  }
}

const model = mongoose.model('Stock', stockSchema)

export const schema = model.schema
export default model