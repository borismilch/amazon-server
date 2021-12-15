import { Router } from "express";
import ProductModel from '../models/ProducModel.js'

const router = Router()

router.get('/products', async (req, res) => {

  const prods = await ProductModel.find()
  console.log(prods)
  res.json(prods)
  
})

router.get('/products/:id', async (req, res) => {

  const product = await ProductModel.findById(req.params.id)

  return res.json(product)
})

router.post('/products/:category', async (req, res) => {

  try {
    const {category} = req.body
    const products = await ProductModel.find({category}) 

    return  res.json(products)

  } catch (e) { console.log(e) }

})

export default router