process.env.NODE_ENV = "test";
const { expect } = require("chai");
const seed = require("../seed/test.seed");
const mongoose = require("mongoose");
const server = require("../server");
const request = require("supertest")(server);
const config = require("../config.js");
const db = config.DB.test;

describe("API endpoints", () => {
  let docs = {};

  beforeEach(function () {

    const p = mongoose.connection.readyState === 0 ? mongoose.connect(db) : Promise.resolve();

    return p
      .then(() => {
        return seed();
      })
      .then(data => {

        docs = data;

      });

  });

  after(function () {

    return mongoose.disconnect();
  });

  describe("api/comments/:comment_id", () => {

    it("GET returns the comment of ID provided", () => {
 
      const commentId = docs.comments[0]._id;

      return request
        .get(`/api/comments/${commentId}`)
        .expect(200)
        .then(res => {

          expect(res.body).to.be.an("object");
          expect(res.body.body).to.be.a("string");
          
        });
    });

    /*ERROR HANDLING **/
    it("GET returns 404 Unable to find comment, with wrong ID provided", () => {

      const commentId = "5b81a5da18e8e60687fbc168";

      return request
        .get(`/api/comments/${commentId}`)
        .expect(404)
        .then(res => {

          expect(res.body).to.be.an("object");
          expect(res.body.message).to.be.equal("Unable to find comment, check ID");
   
        });
    }).timeout(3000);

    it("PUT should increase the votes of an comment by one", () => {

      const commentId = docs.comments[0]._id;

      return request
        .put(`/api/comments/${commentId}?vote=up`)
        .expect(202)
        .then(res => {

          expect(res.body).to.be.an("object");

          return request
            .get(`/api/comments/${commentId}`);
        }).then(res => {
          expect(res.body.votes).to.equal(1);
    
        });
    }).timeout(3000);

    it("PUT should decrease the votes of an comment by one with down query", () => {

      const commentId = docs.comments[0]._id;

      return request
        .put(`/api/comments/${commentId}?vote=down`)
        .expect(202)
        .then(res => {

          expect(res.body).to.be.an("object");

          return request
            .get(`/api/comments/${commentId}`);
        }).then(res => {
          expect(res.body.votes).to.equal(-1);

        });
    });

    /*** ERROR HANDLING */
    it("PUT updateCommentVote returns with error message if query provided was mispelled", () => {

      const commentId = docs.comments[0]._id;

      return request
        .put(`/api/articles/${commentId}?ote=up`)
        .expect(400)
        .then(res => {

          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Please provide a valid query, ie vote=up");

        });
    });

    /*** ERROR HANDLING */
    it("PUT updateCommentVote returns with error message if query value provided is invalid", () => {

      const commentId = docs.comments[0]._id;

      return request
        .put(`/api/comments/${commentId}?vote=banana`)
        .expect(400)
        .then(res => {

          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Please provide a valid query format,ie vote=up or vote=down");
      
        });
    });

    it("DELETE deletes a comment if its by user northcoder", () => {
      const commentId = docs.comments[0]._id;

      return request
        .delete(`/api/comments/${commentId}`)
        .expect(202)
        .then(res => {

          expect(res.body).to.be.an("object");

        });
    });
    //**ERROR HANDLING */
    it("DELETE returns status 404 - Unable to find comment to delete, check ID - if invalid ID is given", () => {
      const commentId = "5b81a5da18e8e60687fbc168";

      return request
        .delete(`/api/comments/${commentId}`)
        .expect(404)
        .then(res => {

          expect(res.body.message).to.be.equal("Unable to find comment to delete, check ID");
     
        });
    });
  });

});

