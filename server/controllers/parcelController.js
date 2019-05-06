import parcelMOdel from "../models/parcelModel";

const Order = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} order object
   */
  create(req, res) {
    const order = req.body;
    if (
      !order.parcelName ||
      !order.weight ||
      !order.receiverName ||
      !order.receiverPhonenumber ||
      !order.destination ||
      !order.pickupLocation ||
      !order.description
    ) {
      return res
        .status(400)
        .json({ status: 400, Error: "All fields are required" });
    } else if (
      typeof order.parcelName !== "string" ||
      isNaN(order.weight) ||
      isNaN(order.receiverPhonenumber) ||
      typeof order.receiverName !== "string" ||
      typeof order.destination !== "string" ||
      typeof order.pickupLocation !== "string" ||
      typeof order.description !== "string"
    ) {
      return res
        .status(400)
        .json({ status: 400, Error: "Invalid Content type" });
    }
    const parcel = parcelMOdel.create(req.body);
    return res.status(201).json({
      status: 201,
      data: [
        {
          newOrder: parcel,
          Message: "created delivery order successfuly"
        }
      ]
    });
  },
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} order array
   */
  getAll(req, res) {
    const orders = parcelMOdel.getAll();
    return res.status(200).json({
      status: 200,
      data: [
        {
          AllOrder: orders,
          Message: "Successful"
        }
      ]
    });
  }
};
export default Order;
