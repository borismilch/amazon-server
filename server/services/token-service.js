import jwt from 'jsonwebtoken'
import env from 'dotenv'
import TokenModel from '../models/token.js'

env.config()

class TokenService {
  generateToken (payload) {

    const accesToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

    return { accesToken, refreshToken }

  }

  validateAccessToken (token) {
    try {
    
      const userData = jwt.verify(token, process.env.JWT_SECRET)
  
      return userData

    } catch (e) { console.log(e, 'Error from validation'); return null }
  }

  validateRefreshToken (token) {
    try {
      console.log('data')
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      console.log(userData)
      return userData

    } catch (e) { return null }
  }

  async saveToken (userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId })

    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await TokenModel.create({ user: userId, refreshToken })

    return token
  }

  async removeToken (refreshToken) {
    const tokenData = await TokenModel.deleteOne({ refreshToken })
    return tokenData
  }

  async findToken (refreshToken) {
    const tokenData = await TokenModel.findOne({ refreshToken })
    console.log(tokenData)
    return tokenData
  }

}

export default new TokenService()