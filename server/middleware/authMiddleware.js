import ApiError from "../exeotions/apiError.js";
import tokenService from "../services/token-service.js";

export default (req, res, next) => {
  try {
    const authToken = req.headers.authorization

    if (!authToken) { return  next(ApiError.UnauthorizedError()) }

    const accessToken = authToken.split(' ')[1]

    if (!accessToken) { return  next(ApiError.UnauthorizedError()) }

    const userData = tokenService.validateAccessToken()

    if (!userData) { return  next(ApiError.UnauthorizedError()) }

    req.user = userData

    next()

  } catch(e) { return next(ApiError.UnauthorizedError()) }

}