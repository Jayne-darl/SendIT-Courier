import db from "../db";

const Order = {
  /**
   * Create a Parcel Order
   * @param {object} req
   * @param {object} res
   * @returns {object} order object
   */
  async create(req, res) {
    const text = `INSERT INTO 
      parcel_order ( placed_by, parcel_name, weight, receiver_name, receiver_phonenumber, destination, pickup_location)
      VALUES ( $1, $2, $3, $4, $5, $6, $7 ) returning *`;
    const values = [
      req.body.placed_by,
      req.body.parcel_name,
      req.body.weight,
      req.body.receiver_name,
      req.body.receiver_phonenumber,
      req.body.destination,
      req.body.pickup_location
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).json({
        status: res.statusCode,
        message: "New parcel added successfuly",
        data: rows[0]
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: `An error occured while trying to save your order ${error}`
      });
    }
  },
  async getAll(req, res) {
      const findAllQuery = 'SELECT * FROM parcel_order';
      try {
        const { rows, rowCount } = await db.query(findAllQuery);
        return res.status(200).json({ 
            status: res.statusCode,
            rows, rowCount });
      } catch(error) {
        return res.status(400).json({
            status: res.statusCode,
            error: `An error occured while trying to save your order ${error}`
          });
      }
  }
};
// module.exports = {create};
export default Order;
