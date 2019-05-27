import Chai from "chai";
import ChaiHttp from "chai-http";
import app from "../server/index";
import db from "../server/db/testdb";

let should = Chai.should();

Chai.use(ChaiHttp);

// parent block
describe("user", () => {
  before(async () => {
    try {
      await db.query(
        "TRUNCATE users CASCADE; ALTER SEQUENCE users_id_seq RESTART WITH 1;"
      );
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

  /**
   * Test the /POST route for create an account
   */
  describe("POST/api/v1/auth/create", () => {
    it("should return user information if registration was successful", done => {
      const user = {
        name: "Jane Uchechukwu",
        email: "janeuche@gmail.com",
        password: "password"
      };
      Chai.request(app)
        .post("/api/v1/auth/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.body.should.have.property("token");
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);
          done(err);
        });
    });
    /**
     * Create admin account
     */
    it("should return user information if registration was successful", done => {
      const user = {
        name: "Tester Admin",
        email: "admin@gmail.com",
        is_admin: true,
        password: "password"
      };
      Chai.request(app)
        .post("/api/v1/auth/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.body.should.have.property("token");
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);
          done(err);
        });
    });
    /**
     * create another user
     */
    it("should return user information if registration was successful", done => {
      const user = {
        name: "Tester person",
        email: "tester@gmail.com",
        password: "password"
      };
      Chai.request(app)
        .post("/api/v1/auth/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.body.should.have.property("token");
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);
          done(err);
        });
    });
    /**
     * Test if all fields are filled
     */
    it("should return some valuse are missing if some fields are empty", done => {
      let newUser = {
        name: "Ayomide",
        email: "kolo@gmail.com",
        password: ""
      };
      Chai.request(app)
        .post("/api/v1/auth/create")
        .send(newUser)
        .end((err, res) => {
          res.should.be.json;
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("Some values are missing");
          done();
        });
    });

    /**
     * Test for valid email address
     */
    it("should return enter a valid email address, if the email address doesn't adhere to the convention", done => {
      let newUser = {
        name: "Ayomide",
        email: "ko@lo@gmail.com",
        password: "1234"
      };
      Chai.request(app)
        .post("/api/v1/auth/create")
        .send(newUser)
        .end((err, res) => {
          res.should.be.json;
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("Please enter a valid email address");
          done();
        });
    });

    /**
     * Test for unique email
     */
    it("should return user with email already exist for existing email", done => {
      const user = {
        name: "Jane Uchechukwu",
        email: "janeuche@gmail.com",
        password: "password"
      };
      Chai.request(app)
        .post("/api/v1/auth/create")
        .send(user)
        .end((err, res) => {
          res.should.be.json;
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("User with that EMAIL already exist");
          done();
        });
    });
  });

  /**
   * Test the /POST route for create an account
   */
  describe("POST api/v1/auth/login", () => {
    it("should return logged in succesfully for user in database", done => {
      const user = {
        email: "janeuche@gmail.com",
        password: "password"
      };
      Chai.request(app)
        .post("/api/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.body.should.have.property("token");
          res.body.should.have
            .property("message")
            .eql("Logged in successfully");
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);
          done();
        });
    });
    /**
     * Test if all fields are filled
     */
    it("should return some valuse are missing if some fields are empty", done => {
      let user = {
        email: "janeuche@gmail.com",
        password: ""
      };
      Chai.request(app)
        .post("/api/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.be.json;
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("Some values are missing");
          done();
        });
    });
    /**
     * Test for valid email address
     */
    it("should return enter a valid email address, if the email address doesn't adhere to the convention", done => {
      let user = {
        email: "ko@lo@gmail.com",
        password: "1234"
      };
      Chai.request(app)
        .post("/api/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.be.json;
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("Please enter a valid email address");
          done();
        });
    });
    /**
     * Test for user without an account
     */
    it("should return user not found for non registered email", done => {
      let user = {
        email: "adaobi@gmail.com",
        password: "1234"
      };
      Chai.request(app)
        .post("/api/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.be.json;
          res.should.have.status(404);
          res.body.should.have.property("status");
          res.body.should.have.property("message").eql("User not found");
          done();
        });
    });
    /**
     * Test for incorret password
     */
    it("should return the password provided is incorrect for incorrect password of a user", done => {
      let user = {
        email: "janeuche@gmail.com",
        password: "passwordt"
      };
      Chai.request(app)
        .post("/api/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.be.json;
          res.should.have.status(400);
          res.body.should.have.property("status");
          res.body.should.have
            .property("message")
            .eql("The password you provided is incorrect");
          done();
        });
    });
  });
});
