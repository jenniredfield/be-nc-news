process.env.NODE_ENV = "test";
const { expect } = require("chai");
const seed = require("../seed/test.seed");
const mongoose = require("mongoose");
const server = require("../server");
const request = require("supertest")(server);



describe("API endpoints", () => {


  beforeEach(function () {

    return mongoose.connection.dropDatabase()
      .then(() => {
        return seed();
      });
  });

  after(function () {

    return mongoose.disconnect();
  });



  describe("/api/users/:username", () => {
    it("returns details of the user required", () => {
      return request
        .get("/api/users/northcoder")
        .expect(200)
        .then(res => {

          expect(res.body).be.an("object");
          expect(res.body.username).to.equal("northcoder");
          expect(res.body.name).to.equal("Awesome Northcoder");

        });
    });

    it("return 404 'User not found' if username was mispelled", () => {
      return request
        .get("/api/users/northcoderrrss")
        .expect(404)
        .then(res => {

          expect(res.body).be.an("object");
          expect(res.body.message).to.equal("User not found");


        });
    });
  });

});


