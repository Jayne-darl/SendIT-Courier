import Chai from "chai";
import ChaiHttp from "chai-http";
import db from "../server/db";
import app from "../server/index";

let should = Chai.should();

Chai.use(ChaiHttp);

// parent block
describe("user", () => {
  // clear users table
  before(async () => {
    try {
      await db.query(
        "TRUNCATE users CASCADE; ALTER SEQUENCE users_id_seq RESTART WITH 1;"
      );
      await db.query(
        "TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;"
      );
    } catch (error) {
      console.log(error);
    }
  });

  //   afterEach(done => {
  //     done();
  //   });

  /**
   * Test the /POST route for create an account
   */
  describe("POST/api/v1/auth/create", () => {
    it("should return user information if registration was successful", done => {
      let newUser = {
        first_name: "Kolo",
        last_name: "Beta",
        email: "kolo@gmail.com",
        password: "01234",
        username: "hello",
        is_admin: "false"
      };
      Chai.request(app)
        .post("/api/v1/auth/create")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property("data");
          res.body.should.have.property("status");
          res.body.should.have.property("token");
          Object.keys(JSON.parse(res.text).data).length.should.be.above(0);
          done();
        });
    });

    /**
     * Test if all fields are filled
     */
    it("should return some valuse are missing if some fields are empty", done => {
      let newUser = {
        first_name: "Kolo",
        last_name: "Beta",
        email: "kolo@gmail.com",
        password: "",
        username: "hello",
        is_admin: "false"
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
    it("should return enter a valid email address, oif the email address doesn't adhere to the convention", done => {
      let newUser = {
        first_name: "Kolo",
        last_name: "Beta",
        email: "ko@lo@gmail.com",
        password: "1234",
        username: "hello",
        is_admin: "false"
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
    it("should return user with email already exist for repetitive email", done => {
      let newUser = {
        first_name: "Kolo",
        last_name: "Beta",
        email: "kolo@gmail.com",
        password: "01234",
        username: "hello",
        is_admin: "false"
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
      let user = {
        email: "kolo@gmail.com",
        password: "01234"
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
        email: "kolo@gmail.com",
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
    it("should return enter a valid email address, oif the email address doesn't adhere to the convention", done => {
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
        email: "kolo@gmail.com",
        password: "234"
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
