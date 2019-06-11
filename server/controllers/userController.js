// import db from "../db";
import db from "../db/testdb";
import Helper from "../helpers/helper";

const nodemailer = require('nodemailer');

class User {
  /**
   * Create A User
   * @params {object} req
   * @params {object} res
   * @returns {object} user object
   */
  static async create(req, res) {
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
    let hashPassword = Helper.hashPassword(req.body.password);
    // console.log(hashPassword);

    const createQuery = `INSERT INTO 
    users(name, email, is_admin, password)
    VALUES($1, $2, $3, $4)
    returning *`;
    const values = [
      req.body.name,
      req.body.email,
      req.body.is_admin,
      hashPassword
    ];
    try {
      const { rows } = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0]);
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
  }
  /**
   * Login
   * @params {object} req
   * @params {object} res
   * @returns {object} user object
   */
  static async login(req, res) {
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
      const token = Helper.generateToken(rows[0]);
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

  /**
   * Send mail on order update
   * @params {object} req
   * @params {object} res
   * @returns {object} 
   */
  static async mail(req, res) {
    const output = `
        <p>${req.body.message}
        <br><br>
        ${req.body.name}<br>
        <br>
        SendIT-Courier<br></p>
        `;
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'janeuchechukwu@gmail.com', // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
    });
    // setup email data with unicode symbols
    const mailOptions = {
      from: '"SendIT Courier" <janeuchechukwu@gmail.com>', // sender address
      to: ` ${req.body.email}`, // list of receivers
      subject: 'The Update on your parcel delivery order', // Subject line
      html: output, // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err)
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return res.status(200)
        .json({
          status: 200,
          message: 'The mail has been sent successfully',
        });
    });
  }
}
export default User;
