import db from "./mockdb";
class Order {
  /**
   * class constructor
   * @param {object} attr
   */
  constructor(attr) {
    Order.count += 1;
    this.id = Order.count;
    this.placedBy = attr.placedBy;
    this.parcelName = attr.parcelName;
    this.weight = attr.weight;
    this.receiverName = attr.receiverName;
    this.receiverPhonenumber = attr.receiverPhonenumber;
    this.destination = attr.destination;
    this.pickupLocation = attr.pickupLocation;
    this.description = attr.description;
    this.createdOn = new Date();
  }

  /**
   *
   * @returns {object} order object
   */

  static create(attr) {
    const parcel = new Order(attr);
    Order.table.push(parcel);
    return parcel;
  }
}
Order.table = db.deliveryOrder;
Order.count = db.deliveryOrder.length;

export default Order;
