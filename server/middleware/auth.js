import jwt from "jsonwebtoken";

class Auth {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  static async verifyToken(req, res, next) {
    const token =
      req.headers["x-access-token"] || req.body["x-access-token"] || null;
    if (!token) {
      return res.status(401).json({
        status: res.statusCode,
        message: "Token is not provided, Please create an account"
      });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      req.user = decoded.id;
      req.adminStatus = decoded.is_admin;
      next();
    } catch (error) {
      return res.status(403).json({
        status: res.statusCode,
        error: error
      });
    }
  }
}

export default Auth;
