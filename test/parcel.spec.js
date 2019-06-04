import Chai from "chai";
import ChaiHttp from "chai-http";
import app from "../server/index";
import db from "../server/db/testdb";

let should = Chai.should();

Chai.use(ChaiHttp);

let userToken;
let adminToken;
let otherToken;

// parent block
describe("Parcel delivery order test", () => {
  before(done => {
    Chai.request(app)
      .post("/api/v1/auth/login")
      .send({ email: "tester@gmail.com", password: "password" })
      .end((err, res) => {
        otherToken = JSON.parse(res.text).token;
        done(err);
      });
  });

  before(done => {
    Chai.request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@gmail.com", password: "password" })
      .end((err, res) => {
        adminToken = JSON.parse(res.text).token;
        done(err);
      });
  });
  afterEach(done => {
    done();
  });
  /**
   * Test the /POST route
   */
  describe("/POST order", () => {
    before(done => {
      Chai.request(app)
        .post("/api/v1/auth/login")
        .send({ email: "janeuche@gmail.com", password: "password" })
        .end((err, res) => {
          userToken = JSON.parse(res.text).token;
          done(err);
        });
    });
    it("it should not post the parcel delivery order if there is no header token provided", done => {
      let newParcel = {
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
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("Token is not provided, Please create an account");
          res.body.should.have.property("status");
          done(err);
        });
    });
    it("should create a parcel delivery order", done => {
      let newParcel = {
        parcel_name: "Food",
        weight: "4",
        receiver_name: "Uche",
        receiver_phonenumber: "080656786",
        destination: "Abia",
        pickup_location: "Road"
      };
      Chai.request(app)
        .post("/api/v1/parcels")
        .set("x-access-token", userToken)
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);
          res.body.should.have
            .property("message")
            .eql("New parcel added successfuly");
          done(err);
        });
    });
    it("should return error if a key-value pair is missing", done => {
      let newParcel = {
        parcel_name: "Food",
        weight: "4",
        receiver_name: "Uche",
        receiver_phonenumber: "080656786",
        destination: "Abia"
      };
      Chai.request(app)
        .post("/api/v1/parcels")
        .set("x-access-token", userToken)
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.have.property("status");
          res.body.should.have.property("error");
          done(err);
        });
    });

    it("should not create a parcel delivery order with invalid token", done => {
      let newParcel = {
        parcel_name: "Food",
        weight: "4",
        receiver_name: "Uche",
        receiver_phonenumber: "080656786",
        destination: "Abia",
        pickup_location: "A cooler of eba"
      };
      Chai.request(app)
        .post("/api/v1/parcels")
        .set("x-access-token", "yuegruy74rweyurtwu6t")
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.have.property("status");
          res.body.should.have.property("error");
          done(err);
        });
    });
  });
  /**
   * Test the /GET route
   */
  describe("/GET Orders", () => {
    it("should not return orders without header token or an empty one", done => {
      Chai.request(app)
        .get("/api/v1/parcels")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("Token is not provided, Please create an account");
          res.should.be.json;
          done(err);
        });
    });
    it("should return you have not created any parcel", done => {
      Chai.request(app)
        .get("/api/v1/parcels")
        .set("x-access-token", otherToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("You have not created any parcels");
          done(err);
        });
    });
    it("should return all parcel delivery order in the database", done => {
      Chai.request(app)
        .get("/api/v1/parcels")
        .set("x-access-token", adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.should.have.property("rows");
          done(err);
        });
    });
  });

  /**
   * Test the /GET/:id route
   */
  describe("/GET/:id Order", () => {
    it("should not return order without header token", done => {
      Chai.request(app)
        .get("/api/v1/parcels/56")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.should.have.property("message");
          res.should.be.json;
          done(err);
        });
    });

    it("should return not found for parcel not created by user", done => {
      Chai.request(app)
        .get("/api/v1/parcels/9")
        .set("x-access-token", userToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("message");
          res.body.should.have
            .property("message")
            .eql("No such delivery order was created by you");
          res.body.should.have.property("status");
          res.should.be.json;
          done(err);
        });
    });
    it("should return a parcel delivery order with id", done => {
      Chai.request(app)
        .get("/api/v1/parcels/1")
        .set("x-access-token", userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.should.be.json;
          done(err);
        });
    });
    it("should return any parcel delivery order in the database", done => {
      Chai.request(app)
        .get("/api/v1/parcels/1")
        .set("x-access-token", adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.should.have.property("data");
          done(err);
        });
    });
    it("should return not found for unavailable", done => {
      Chai.request(app)
        .get("/api/v1/parcels/9")
        .set("x-access-token", adminToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("message");
          res.body.should.have
            .property("message")
            .eql("Delivery order not found");
          res.body.should.have.property("status");
          res.should.be.json;
          done(err);
        });
    });
    //   it("should return error parcel delivery order with alphabetical id", done => {
    //     Chai.request(app)
    //       .patch("/api/v1/parcels/1e")
    //       .set("x-access-token", userToken)
    //       .end((err, res) => {
    //         res.should.have.status(500);
    //         res.body.should.have.property("status");
    //         res.body.should.have.property("error");
    //         res.should.be.json;
    //         done(err);
    //       });
    //   });
  });

  /**
   * Test the /PATCH/:id/cancel order
   */
  describe("/PATCH/cancel/:id Cancel Order", () => {
    it("should not cancel order under without token ", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/cancel/y")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.should.have.property("message");
          res.should.be.json;
          done();
        });
    });
    it("should return not bad request for parcel not created by a user", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/cancel/1")
        .set("x-access-token", otherToken)
        .send({ status: "Cancelled" })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .eql("Only parcel owners can cancel their delivery order");
          res.body.should.have.property("status");
          res.should.be.json;
          done(err);
        });
    });
    it("should cancel and return a parcel delivery order with id", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/cancel/1")
        .set("x-access-token", userToken)
        .send({ status: "Cancelled" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("Your parcel delivery order has been successfully cancelled");
          res.should.be.json;
          done(err);
        });
    });
    it("should return error", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/cancel/1e")
        .set("x-access-token", userToken)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have.property("status");
          res.body.should.have.property("error");
          res.should.be.json;
          done(err);
        });
    });
  });
  /**
   * describe /PATCH for admin
   */
  describe("PATCH /api/v1/parcels/update", () => {
    it("should return there is no parcel in database", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/3")
        .set("x-access-token", adminToken)
        .send({ status: "Delivered" })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("No parcel with such id exist in the database");
          done(err);
        });
    });
    it("should update parcel in database", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/1")
        .set("x-access-token", adminToken)
        .send({ status: "Delivered", current_location: "aba" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.should.have.property("data");
          res.body.should.have
            .property("message")
            .eql("The parcel delivery order has been successfully updated");
          done(err);
        });
    });
    it("should return update parcel in database", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/1")
        .set("x-access-token", userToken)
        .send({ status: "Delivered", current_location: "aba" })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("Only admin can update delivery order");
          done(err);
        });
    });
    it("should return update parcel in database", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/1")
        .set("x-access-token", adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("The parcel delivery order has been successfully updated");
          done(err);
        });
    });
  });
});
