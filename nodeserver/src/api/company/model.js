import mongoose, { Schema } from 'mongoose'

const companySchema = new Schema({
  ticker: {
    type: String
  },
  name: {
    type: String
  }
}, {
  timestamps: true
})

companySchema.methods = {
  view (full) {
    let view = {}
    view.ticker  = this.ticker;
    view.name  = this.name;
    view.id = this.id;

    if (full) {
      view.createdAt = this.createdAt;
      view.updatedAt = this.updatedAt;
    }     

    return view;
  }
}

const model = mongoose.model('Company', companySchema)

export const schema = model.schema
export default model