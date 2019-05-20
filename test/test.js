import Chai from "chai";
import ChaiHttp from "chai-http";
import app from "../server/index";

let should = Chai.should();

Chai.use(ChaiHttp);

// parent block
describe("Parcel delivery order test", () => {
  afterEach(done => {
    done();
  });
  /**
   * Test the /POST route
   */
  describe("/POST order", () => {
    it("it should not post the parcel delivery order due to server error", done => {
      let newParcel = {
        placed_by: "1",
        parcel_name: "Food",
        weight: "4",
        receiver_name: "Uche",
        receiver_phonenumber: "080656786",
        destination: "Abia",
        description: "A cooler of eba"
      };
      Chai.request(app)
        .post("/api/v1/parcels")
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.have.property("error");
          res.body.should.have.property("status");
          done();
        });
    });
    it("it post the parcel delivery order", done => {
      let newParcel = {
        placed_by: "1",
        parcel_name: "Food",
        weight: "4",
        receiver_name: "Uche",
        receiver_phonenumber: "080656786",
        destination: "Abia",
        pickup_location: "Road"
      };
      Chai.request(app)
        .post("/api/v1/parcels")
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.body.data.should.have.property("placed_by");
          res.body.data.should.have.property("parcel_name");
          res.body.data.should.have.property("weight");
          res.body.data.should.have.property("receiver_name");
          res.body.data.should.have.property("receiver_phonenumber");
          res.body.data.should.have.property("destination");
          res.body.data.should.have.property("pickup_location");
          res.body.should.have.property("message");
          res.body.should.have
            .property("message")
            .eql("New parcel added successfuly");
          done();
        });
    });
  });
});
/**
 * Test the /GET route
 */
describe("/GET Orders", () => {
  it("should return all parcel delivery order", done => {
    Chai.request(app)
      .get("/api/v1/parcels")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("rows");
        res.body.should.have.property("status");
        res.body.should.have.property("rowCount");
        res.body.rows.should.be.a("array");
        done();
      });
  });
});
/**
 * Test the /GET/:id route
 */
// describe("/GET/:id Order", () => {
//   it("should return invalid id type for a non-integer id ", done => {
//     Chai.request(app)
//       .get("/api/v1/parcels/y")
//       .end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property("status");
//         res.body.should.have.property("Error");
//         res.should.be.json;
//         done();
//       });
//   });
//   it("should return not found for an invalid id", done => {
//     Chai.request(app)
//       .get("/api/v1/parcels/9")
//       .end((err, res) => {
//         res.should.have.status(404);
//         res.body.should.have.property("Error");
//         res.body.should.have.property("status");
//         res.should.be.json;
//         done();
//       });
//   });
//   it("should return a parcel delivery order with id", done => {
//     Chai.request(app)
//       .get("/api/v1/parcels/4")
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property("data");
//         res.body.should.have.property("status");
//         res.should.be.json;
//         res.body.data[0].should.have.property("Order");
//         res.body.data[0].should.have.property("Message");
//         done();
//       });
//   });
// });
// /**
//  * Test the /PATCH/:id/cancel order
//  */
// describe("/PATCH/:id Cancel Order", () => {
//   it("should return invalid id type for a non-integer id ", done => {
//     Chai.request(app)
//       .patch("/api/v1/parcels/y")
//       .end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property("status");
//         res.body.should.have.property("Error");
//         res.should.be.json;
//         done();
//       });
//   });
//   it("should return not found for an invalid id", done => {
//     Chai.request(app)
//       .patch("/api/v1/parcels/9")
//       .end((err, res) => {
//         res.should.have.status(404);
//         res.body.should.have.property("Error");
//         res.body.should.have.property("status");
//         res.should.be.json;
//         done();
//       });
//   });
//   it("should update and return a parcel delivery order with id", done => {
//     Chai.request(app)
//       .patch("/api/v1/parcels/4")
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property("data");
//         res.body.should.have.property("status");
//         res.should.be.json;
//         res.body.data[0].should.have.property("Order");
//         res.body.data[0].should.have.property("Message");
//         done();
//       });
//   });
// });
