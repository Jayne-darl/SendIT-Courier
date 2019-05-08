import parcelController from "../server/controllers/parcelController";
import Chai from "chai";
import ChaiHttp from "chai-http";
import app from "../index";

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
    it("it should not post the parcel delivery order with unfilled fields", done => {
      let newParcel = {
        placedBy: "Azuka",
        parcelName: "Food",
        weight: "4",
        receiverName: "Uche",
        receiverPhonenumber: "080656786",
        destination: "Abia",
        description: "A cooler of eba"
      };
      Chai.request(app)
        .post("/api/v1/parcels")
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property("Error");
          res.body.should.have.property("status");
          res.body.should.have.property("Error").eql("All fields are required");
          done();
        });
    });
    it("it should not post the parcel delivery order with invalid content type", done => {
      let newParcel = {
        placedBy: "Azuka",
        parcelName: "Food",
        weight: "4",
        receiverName: 4,
        receiverPhonenumber: "080656786",
        destination: "Abia",
        pickupLocation: "love",
        description: "A cooler of eba"
      };
      Chai.request(app)
        .post("/api/v1/parcels")
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property("Error");
          res.body.should.have.property("status");
          res.body.should.have.property("Error").eql("Invalid Content type");
          done();
        });
    });
    it("it post the parcel delivery order", done => {
      let newParcel = {
        placedBy: "Azuka",
        parcelName: "Food",
        weight: "4",
        receiverName: "Uche",
        receiverPhonenumber: "080656786",
        destination: "Abia",
        pickupLocation: "Road",
        description: "A cooler of eba"
      };
      Chai.request(app)
        .post("/api/v1/parcels")
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.body.data[0].should.have.property("newOrder");
          res.body.data[0].newOrder.should.have.property("placedBy");
          res.body.data[0].newOrder.should.have.property("parcelName");
          res.body.data[0].newOrder.should.have.property("weight");
          res.body.data[0].newOrder.should.have.property("receiverName");
          res.body.data[0].newOrder.should.have.property("receiverPhonenumber");
          res.body.data[0].newOrder.should.have.property("destination");
          res.body.data[0].newOrder.should.have.property("pickupLocation");
          res.body.data[0].newOrder.should.have.property("description");
          res.body.data[0].newOrder.should.have.property("placedBy");
          res.body.data[0].should.have.property("Message");
          res.body.data[0].should.have
            .property("Message")
            .eql("created delivery order successfuly");
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
        res.body.should.have.property("data");
        res.body.should.have.property("status");
        res.body.data[0].should.have.property("AllOrder");
        res.body.data[0].AllOrder.should.be.a("array");
        res.body.data[0].should.have.property("Message");
        done();
      });
  });
});
/**
 * Test the /GET/:id route
 */
describe("/GET/:id Order", () => {
  it("should return invalid id type for a non-integer id ", done => {
    Chai.request(app)
      .get("/api/v1/parcels/y")
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("status");
        res.body.should.have.property("Error");
        res.should.be.json;
        done();
      });
  });
  it("should return not found for an invalid id", done => {
    Chai.request(app)
      .get("/api/v1/parcels/9")
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("Error");
        res.body.should.have.property("status");
        res.should.be.json;
        done();
      });
  });
  it("should return a parcel delivery order with id", done => {
    Chai.request(app)
      .get("/api/v1/parcels/4")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("data");
        res.body.should.have.property("status");
        res.should.be.json;
        res.body.data[0].should.have.property("Order");
        res.body.data[0].should.have.property("Message");
        done();
      });
  });
});
/**
 * Test the /PATCH/:id/cancel order
 */
describe("/PATCH/:id Cancel Order", () => {
  it("should return invalid id type for a non-integer id ", done => {
    Chai.request(app)
      .patch("/api/v1/parcels/y")
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("status");
        res.body.should.have.property("Error");
        res.should.be.json;
        done();
      });
  });
  it("should return not found for an invalid id", done => {
    Chai.request(app)
      .patch("/api/v1/parcels/9")
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property("Error");
        res.body.should.have.property("status");
        res.should.be.json;
        done();
      });
  });
  it("should update and return a parcel delivery order with id", done => {
    Chai.request(app)
      .patch("/api/v1/parcels/4")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("data");
        res.body.should.have.property("status");
        res.should.be.json;
        res.body.data[0].should.have.property("Order");
        res.body.data[0].should.have.property("Message");
        done();
      });
  });
});
