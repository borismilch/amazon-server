import stripeInit from 'stripe'
import OrderModel from "../models/OrderModel.js";

const stripe = stripeInit(process.env.STRIPE_SECRET)

class StripeController {
  async payOrDie (req, res) {
    try {
      const { items, email, total } = req.body
  
      const transformedItems = items.map(item => ({
        decription: item.decription,
        quantity: item.count,
        price_data: {
          currency: 'usd',
          unit_amount: item.price * 100,
          product_data: {
            name: item.title,
            images: [item.image],
          },
    
        }
      }))
    
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: transformedItems,
        mode: "payment",
        shipping_rates: ["shr_1K6HT4InFtjHZp0On6bpraIi"],
        success_url: process.env.CLIENT_URL + '/success',
        cancel_url: process.env.CLIENT_URL + '/cart',
        shipping_address_collection: {
          allowed_countries: ["GB", "US", "CA"]
        },
        metadata: {
          email,
          images: JSON.stringify(items.map(t => t.image))
        }
    
      })
  
      const newSession = {
        items, date: Date.now(), total: Math.floor(total), currency: 'usd', owner: email
      }
  
      await OrderModel.create(newSession)
      console.log('success')
  
      
      res.status(200).json({ id:session.id })
  
    } catch (e) { console.log(e) }
  }

  async getOrders(req, res) {
    const { email } = req.body
    const orders = await OrderModel.find({ owner: email })

    if (!orders) { res.json([]) }

    res.status(200).json(orders)
  }

}


export default new StripeController()