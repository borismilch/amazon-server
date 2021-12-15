import mongoose from 'mongoose'

const ProductModel = mongoose.Schema({
  title: { type: String, required: true },
  id: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  count: { type: Number, default: 1 },

  raiting: { type: mongoose.Schema.Types.ObjectId, ref: 'Raiting' }
})

const schema = mongoose.Schema({
  currency: { type: String, required: true },
  items: [ProductModel],
  date: { type: Number, required: true },
  total: { type: Number, required: true },
  owner: { type: String, required: true }
})

export default mongoose.model('Order', schema)