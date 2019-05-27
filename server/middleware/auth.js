import jwt from "jsonwebtoken";
// import db from "../db";
// import db from "../db/testdb";

const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyToken(req, res, next) {
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
      // const text = "SELECT * FROM users WHERE id = $1";
      // const { rows } = await db.query(text, [decoded.userId]);
      // if (!rows[0]) {
      //   return res.status(400).json({
      //     status: res.statusCode,
      //     message: "The token you provided is invalid"
      //   });
      // }
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
};

export default Auth;
