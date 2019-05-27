import db from "../db";
import Helper from "../helpers/helper";

const User = {
  /**
   * Create A User
   * @params {object} req
   * @params {object} res
   * @returns {object} user object
   */
  async create(req, res) {
    if (!req.body.email || !req.body.password || req.body.password.length < 1) {
      return res.status(400).json({
        status: res.statusCode,
        message: "Some values are missing"
      });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).json({
        status: res.statusCode,
        message: "Please enter a valid email address"
      });
    }
    const hashPassword = Helper.hashPassword(req.body.password);
    // console.log(hashPassword);

    const createQuery = `INSERT INTO 
    users(first_name, last_name, email, username, is_admin, password)
    VALUES($1, $2, $3, $4, $5, $6)
    returning *`;
    const values = [
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.username,
      req.body.is_admin,
      hashPassword
    ];
    try {
      const { rows } = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).json({
        status: res.statusCode,
        token: token,
        data: rows[0]
      });
    } catch (error) {
      if (error.routine === "_bt_check_unique") {
        return res.status(400).json({
          status: res.statusCode,
          message: "User with that EMAIL already exist"
        });
      }
      return res.status(500).json({
        status: res.statusCode,
        error: `An error occured while trying to create an account ${error}`
      });
    }
  },
  /**
   * Login
   * @params {object} req
   * @params {object} res
   * @returns {object} user object
   */
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: res.statusCode,
        message: "Some values are missing"
      });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).json({
        status: res.statusCode,
        message: "Please enter a valid email address"
      });
    }
    const text = "SELECT * FROM users WHERE email = $1";
    try {
      const { rows } = await db.query(text, [req.body.email]);
      console.log(rows);
      if (!rows[0]) {
        return res.status(404).json({
          status: res.statusCode,
          message: "User not found"
        });
      }
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).json({
          status: res.statusCode,
          message: "The password you provided is incorrect"
        });
      }
      const token = Helper.generateToken(rows[0].id);
      return res.status(200).json({
        status: res.statusCode,
        token: token,
        data: rows[0],
        message: "Logged in successfully"
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: `An error occured while trying to log in ${error}`
      });
    }
  }
};
export default User;
