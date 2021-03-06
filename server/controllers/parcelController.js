// import db from "../db";
import db from "../db/testdb";

class Order {
  /**
   * Create a Parcel Order
   * @param {object} req
   * @param {object} res
   * @returns {object} order object
   */
  static async create(req, res) {
    const text = `INSERT INTO 
      parcel_order ( placed_by, parcel_name, weight, receiver_name, receiver_phonenumber, destination, pickup_location)
      VALUES ( $1, $2, $3, $4, $5, $6, $7 ) returning *`;
    const values = [
      req.user,
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
        error: error
      });
    }
  }
  /**
   * Get all Parcel Orders
   * @param {object} req
   * @param {object} res
   * @returns {object} Parcel Orders Array
   */
  static async getAll(req, res) {
    if (!req.adminStatus) {
      const findAllQuery = `SELECT * FROM parcel_order WHERE placed_by = '${
        req.user
        }'`;
      try {
        const { rows, rowCount } = await db.query(findAllQuery);
        if (rowCount === 0) {
          return res.status(404).json({
            status: res.statusCode,
            message: "You have not created any parcels"
          });
        }
        return res.status(200).json({
          status: res.statusCode,
          rows,
          rowCount
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: error
        });
      }
    } else {
      const findAllQuery = `SELECT * FROM parcel_order`;
      try {
        const { rows, rowCount } = await db.query(findAllQuery);
        if (rowCount === 0) {
          return res.status(404).json({
            status: res.statusCode,
            message: "There is no parcel delivery order in the database"
          });
        }
        return res.status(200).json({
          status: res.statusCode,
          rows,
          rowCount
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: error
        });
      }
    }
  }
  /**
   * Get a Parcel Order
   * @Param {object} req
   * @Param {object} res
   * @returns {object} parcel object
   */
  static async getOne(req, res) {
    if (!req.adminStatus) {
      const findOneQuery = `SELECT * FROM parcel_order WHERE id = $1 AND placed_by ='${
        req.user
        }'`;
      try {
        const { rows, rowCount } = await db.query(findOneQuery, [
          req.params.id
        ]);
        if (rowCount === 0) {
          return res.status(404).json({
            status: res.statusCode,
            message: "No such delivery order was created by you"
          });
        }
        return res.status(200).json({
          status: res.statusCode,
          data: rows[0]
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: error
        });
      }
    } else {
      const text = `SELECT * FROM parcel_order WHERE id = $1`;
      try {
        const { rows, rowCount } = await db.query(text, [req.params.id]);
        if (rowCount === 0) {
          return res.status(404).json({
            status: res.statusCode,
            message: "Delivery order not found"
          });
        }
        return res.status(200).json({
          status: res.statusCode,
          data: rows[0]
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: error
        });
      }
    }
  }
  /**
   * Update delivery order status: Cancel order
   * @param {object} req
   * @param {object} res
   * @returns {object} updated order status
   */
  static async cancel(req, res) {
    const findOneQuery = `SELECT * FROM parcel_order WHERE id = $1 AND placed_by ='${
      req.user
      }'`;
    const updateOneQuery = `UPDATE parcel_order SET status = $1, updated_at = $2 WHERE id=$3 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(400).json({
          status: res.statusCode,
          message: "Only parcel owners can cancel their delivery order"
        });
      }
      const values = [
        (req.body.status = "Cancelled"),
        new Date(),
        req.params.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).json({
        status: res.statusCode,
        data: response.rows[0],
        message: "Your parcel delivery order has been successfully cancelled"
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: error
      });
    }
  }
  static async update(req, res) {
    if (req.adminStatus) {
      const findOneQuery = `SELECT * FROM parcel_order WHERE id = $1 `;
      const updateOneQuery = `UPDATE parcel_order SET status = $1, current_location = $2,updated_at = $3 WHERE id=$4 returning *`;
      try {
        const { rows } = await db.query(findOneQuery, [req.params.id]);
        if (!rows[0]) {
          return res.status(404).json({
            status: res.statusCode,
            message: "No parcel with such id exist in the database"
          });
        }
        const values = [
          req.body.status || rows[0].status,
          req.body.current_location || rows[0].current_location,
          new Date(),
          req.params.id
        ];
        const response = await db.query(updateOneQuery, values);
        return res.status(200).json({
          status: res.statusCode,
          data: response.rows[0],
          message: "The parcel delivery order has been successfully updated"
        });
      } catch (error) {
        return res.status(500).json({
          status: res.statusCode,
          error: `${error}`
        });
      }
    }
    return res.status(400).json({
      status: res.statusCode,
      message: "Only admin can update delivery order"
    });
  }
  static async changeDestination(req, res) {
    const findOneQuery = `SELECT * FROM parcel_order WHERE id = $1 AND placed_by ='${
      req.user
      }'`;
    const updateOneQuery = `UPDATE parcel_order SET destination = $1, updated_at = $2 WHERE id=$3 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(400).json({
          status: res.statusCode,
          message: "Only parcel owners change their delivery order destination"
        });
      }
      if (rows[0].status == 'Delivered' || rows[0].status == 'In transit') {
        return res.status(409).json({
          status: res.statusCode,
          message: "You can only change destination of pending orders"
        })
      }
      const values = [
        (req.body.destination),
        new Date(),
        req.params.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).json({
        status: res.statusCode,
        data: response.rows[0],
        message: "The destination of your parcel delivery order has been successfully updated"
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: error
      });
    }
  }
}
export default Order;
