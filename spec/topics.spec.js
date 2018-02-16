process.env.NODE_ENV = "test";
const { expect } = require("chai");
const seed = require("../seed/test.seed");
const mongoose = require("mongoose");
const server = require("../server");
const request = require("supertest")(server);
const config = require("../config.js");
const db = config.DB.test;

describe("API endpoints", () => {
  
  beforeEach(function () {
    
    const p = mongoose.connection.readyState === 0 ? mongoose.connect(db) : Promise.resolve();
    
    return p
      .then(() => {
        return seed();
      });
  });

  after(function () {

    return mongoose.disconnect();
  });

  describe("/api/topics", () => {

    it("GET returns all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
              
          expect(res.body).be.an("object");
          expect(res.body.topics).to.be.an("array");

        });
    });
  });

  describe("/api/topics/:topic/articles", () => {

    it("GET returns all articles for a topic", () => {
      return request
        .get("/api/topics/football/articles")
        .expect(200)
        .then(res => {
                    
          expect(res.body).be.an("object");
          expect(res.body.articles).to.be.an("array");

        });
    });
    /*** ERROR HANDLING */
    it("GET returns 404 and  \"Unable to find topic name\" if topic is mispelled", () => {
      return request
        .get("/api/topics/footballe/articles")
        .expect(404)
        .then(res => {
                    
          expect(res.body.message).be.equal("Unable to find topic name");

        });
    });
  });

});

