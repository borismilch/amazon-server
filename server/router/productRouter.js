import { Router } from "express";
import ProductModel from '../models/ProducModel.js'
const router = Router()

router.get('/products', async (req, res) => {

  const prods = await ProductModel.find()
  console.log(prods)
  res.json(prods)
  
})

export default router