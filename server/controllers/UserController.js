import userService from "../services/user-service.js"

import ApiError from "../exeotions/apiError.js"

import chack from 'express-validator/check/index.js'

const { validationResult } = chack

class UserController {

  async register (req, res, next) {
    try {
      const errors = validationResult(req)

      console.log(errors)

      if (!errors.isEmpty()) { return next(ApiError.BadRequest('Validation Error Fuck you', errors.array())) }
      
      const { email, password } = req.body
      console.log(email, password)
      const userData = await userService.registration(email, password)
      
      res.cookie('refreshToken', userData.refreshToken , { maxAge: 3600 * 24 * 30 * 10000, httpOnly: true })

      return res.json(userData)
    } catch (e) { console.log(e) } 
  }

  async login (req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)

      res.cookie('refreshToken', userData.refreshToken , { maxAge: 3600 * 24 * 30 * 10000, httpOnly: true })

      return res.json(userData)
    }
    
    catch (e) { next(e) } 
  }

  async activate (req, res, next) {
    try {
      const activateLink = req.params.link
      await userService.activate(activateLink)

      return res.redirect(process.env.CLIENT_URL)
    } catch (e) { console.log(e) } 
  }

  async refresh(req, res, next) {
    try {
        const {refreshToken} = req.cookies;
        console.log(refreshToken)
        const userData = await userService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData);
    } catch (e) {
        next(e);
    }
}

  async logout (req, res, next) {
    try {
      const { refreshToken } = req.cookies
      console.log('COOCKA')
      const { token } = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')

      return res.json(token)
    }
    
    catch (e) {

    } 
  }

  async getUsers (req, res, next) {
    try {
      const users = await userService.getUsers()
      return res.json(users)
    }
    
    catch (e) { next(e) } 
  }

}

export default new UserController()