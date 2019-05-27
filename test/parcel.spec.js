import Chai from "chai";
import ChaiHttp from "chai-http";
import db from "../server/db";
import app from "../server/index";

let should = Chai.should();

Chai.use(ChaiHttp);

// parent block
describe("Parcel delivery order test", () => {
  before(async () => {
    try {
      await db.query(
        "TRUNCATE parcel_order; ALTER SEQUENCE parcel_order_id_seq RESTART WITH 1;"
      );
    } catch (error) {
      console.log(error);
    }
  });
  // afterEach(done => {
  //   done();
  // });
  // /**
  //  * Test the /POST route
  //  */
  describe("/POST order", () => {
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
          res.body.should.have
            .property("message")
            .eql("Token is not provided, Please create an account");
          res.body.should.have.property("status");
          done();
        });
    });
    it("should create a parcel delivery order", done => {
      const agent = Chai.request.agent(app);
      let newParcel = {
        parcel_name: "Food",
        weight: "4",
        receiver_name: "Uche",
        receiver_phonenumber: "080656786",
        destination: "Abia",
        pickup_location: "Road"
      };

      agent
        .post("/api/v1/auth/login")
        .send({
          email: "kolo@gmail.com",
          password: "01234"
        })
        .then(res => {
          const token = JSON.parse(res.text).token;
          res.status.should.eql(200);
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);

          return agent
            .post("/api/v1/parcels")
            .set("x-access-token", token)
            .send(newParcel)
            .then(res => {
              res.should.have.status(201);
              res.should.be.json;
              res.body.should.have.property("data");
              res.body.should.have.property("status");
              Object.keys(JSON.parse(res.text).data).length.should.be.above(0);
              res.body.should.have
                .property("message")
                .eql("New parcel added successfuly");
            })
            .then(() => {
              done();
              agent.close();
            });
        });

      it("should not create a parcel delivery order with invalid token", done => {
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
          .set("x-access-token", token)
          .send(newParcel)
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have
              .property("message")
              .eql("The token you provided is invalid");
            res.body.should.have.property("status");
            done();
          });
      });
    });
  });
  /**
   * Test the /GET route
   */
  describe("/GET Orders", () => {
    it("should not return orders without header token", done => {
      Chai.request(app)
        .get("/api/v1/parcels")
        .end((end, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.should.have.property("message");
          res.should.be.json;
          done();
        });
    });
    it("should return all parcel delivery order with header token", done => {
      const agent = Chai.request.agent(app);

      agent
        .post("/api/v1/auth/login")
        .send({
          email: "kolo@gmail.com",
          password: "01234"
        })
        .then(res => {
          const token = JSON.parse(res.text).token;
          res.status.should.eql(200);
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);

          return agent
            .get("/api/v1/parcels")
            .set("x-access-token", token)
            .then(res => {
              res.should.have.status(200);
              res.body.should.have.property("status");
              res.body.should.have.property("rows");
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  });
  /**
   * Test the /GET/:id route
   */
  describe("/GET/:id Order", () => {
    it("should not return order without header token", done => {
      Chai.request(app)
        .get("/api/v1/parcels/1")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.should.have.property("message");
          res.should.be.json;
          done();
        });
    });
    it("should return a parcel delivery order with header token", done => {
      const agent = Chai.request.agent(app);

      agent
        .post("/api/v1/auth/login")
        .send({
          email: "kolo@gmail.com",
          password: "01234"
        })
        .then(res => {
          const token = JSON.parse(res.text).token;
          res.status.should.eql(200);
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);

          return agent
            .get("/api/v1/parcels/1")
            .set("x-access-token", token)
            .then(res => {
              res.should.have.status(200);
              res.body.should.have.property("status");
              res.body.should.have.property("data");
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  });

  //   it("should return not found for an invalid id", done => {
  //     Chai.request(app)
  //       .get("/api/v1/parcels/9")
  //       .end((err, res) => {
  //         res.should.have.status(404);
  //         res.body.should.have.property("message");
  //         res.body.should.have
  //           .property("message")
  //           .eql("delivery order not found");
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
  //         done();
  //       });
  //   });
  // });
  // /**
  //  * Test the /PATCH/:id/cancel order
  //  */
  describe("/PATCH/:id Cancel Order", () => {
    it("should not update under without token ", done => {
      Chai.request(app)
        .patch("/api/v1/parcels/y")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("status");
          res.body.should.have.property("message");
          res.should.be.json;
          done();
        });
    });
    it("should return a parcel delivery order with header token", done => {
      const agent = Chai.request.agent(app);

      agent
        .post("/api/v1/auth/login")
        .send({
          email: "kolo@gmail.com",
          password: "01234"
        })
        .then(res => {
          const token = JSON.parse(res.text).token;
          res.status.should.eql(200);
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);

          return agent
            .patch("/api/v1/parcels/1")
            .set("x-access-token", token)
            .then(res => {
              res.should.have.status(200);
              res.body.should.have.property("status");
              res.body.should.have.property("data");
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
    // it("should return not found for an invalid id", done => {
    //   Chai.request(app)
    //     .patch("/api/v1/parcels/9")
    //     .end((err, res) => {
    //       res.should.have.status(404);
    //       res.body.should.have.property("message");
    //       res.body.should.have.property("status");
    //       res.should.be.json;
    //       done();
    //     });
    // });
    // it("should update and return a parcel delivery order with id", done => {
    //   Chai.request(app)
    //     .patch("/api/v1/parcels/4")
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.have.property("data");
    //       res.body.should.have.property("status");
    //       res.should.be.json;
    //       done();
  });
});
// });
