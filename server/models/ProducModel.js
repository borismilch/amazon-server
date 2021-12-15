import mongoose from 'mongoose'

const raitSchema = mongoose.Schema({
  rait: { type: Number, required: true },
  count: { type: Number, required: true }
})  

const schema = mongoose.Schema({
  title: { type: String, required: true },
  id: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  count: { type: Number, default: 1 },

  raiting: raitSchema
})

export default mongoose.model('Product', schema)