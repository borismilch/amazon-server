import UserModel from '../models/user.js'
import bcypt from 'bcrypt'
import {v4 as uuid} from 'uuid'
import MailService from './mail-service.js'

import UserDto from '../dots/user-dro.js'

import ApiError from '../exeotions/apiError.js'

import tokenService from './token-service.js'

const apiError = new ApiError()

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email })
    

    if (candidate) {
      
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }

    console.log('CLEN')
  
    const hashedPassword = await bcypt.hash(password, 3)

    const activationLink = uuid()

    const user = await UserModel.create({ email, password:hashedPassword, activationLink })

    const userDto = new UserDto(user)

    await MailService.sendActivationMail(email, process.env.API_URL + '/api/activate/' +  activationLink)

    const tokens = tokenService.generateToken({ ...userDto, activationLink: '' })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    console.log(userDto, hashedPassword)

    return { ...tokens, user }

  }

  async login (email, password) {
    const user = await UserModel.findOne({ email })

    if (!user) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не существует`)
    }

    const isPassword = bcrypt.compare(password, user.password)

    if (!isPassword) {
      throw ApiError.BadRequest(`Incorrect password`)
    }

    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user }

  }

  async logout (refreshToken) {
   
    const token = await tokenService.removeToken(refreshToken)

    console.log(refreshToken)
    return token
  }

  async activate (activationLink) {
    const user = await UserModel.findOne({activationLink})

    if (!user) { throw ApiError.BadRequest('Неккоректная ссылка активации') }

    user.isActivated = true
    await user.save()
  }

  async refresh (refreshToken) {
   
    if (!refreshToken) {
      throw ApiError.BadRequest('You have not tokens')
    } 

    const userData = tokenService.validateRefreshToken(refreshToken)

    const tokenFromDB = await tokenService.findToken(refreshToken)

    console.log(tokenFromDB, 'user from token')

    if (!userData || !tokenFromDB) {
      throw ApiError.BadRequest('Auth problems bot')
    }

    const user = await UserModel.findById(userData.id)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    console.log(user, tokens)

    return { ...tokens, user }

  }

  async getUsers () {
    const users = await UserModel.find()
    return users
  }
}

export default new UserService()