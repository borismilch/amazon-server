import mongoose from 'mongoose'

const schema = mongoose.Schema({
  rait: { type: Number, required: true },
  count: { type: Number, required: true }

})

export default mongoose.model('Raiting', schema)