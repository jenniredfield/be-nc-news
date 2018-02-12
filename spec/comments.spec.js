process.env.NODE_ENV = "test";
const { expect } = require("chai");
const seed = require("../seed/test.seed");
const mongoose = require("mongoose");
const server = require("../server");
const request = require("supertest")(server);



describe("API endpoints", () => {
  let docs = {};

  beforeEach(function () {

    return mongoose.connection.dropDatabase()
      .then(() => {
        return seed();
      })
      .then(data => {

        docs = data;
        // console.log(docs)
      });

  });

  after(function () {

    return mongoose.disconnect();
  });


  describe("api/comments/:comment_id", (done) => {

    it("GET returns the comment of ID provided", () => {

      const commentId = docs.comments[0]._id;

      return request
        .get(`/api/comments/${commentId}`)
        .expect(200)
        .then(res => {

          expect(res.body).to.be.an("object");
          expect(res.body.body).to.be.a("string");
          done();
        });
    });

    /*ERROR HANDLING **/
    it("GET returns 404 Unable to find comment, with wrong ID provided", (done) => {

      const commentId = "5b81a5da18e8e60687fbc168";

      return request
        .get(`/api/comments/${commentId}`)
        .expect(404)
        .then(res => {

          expect(res.body).to.be.an("object");
          expect(res.body.message).to.be.equal("Unable to find comment, check ID");
          done();
        });
    });

    it("PUT should increase the votes of an comment by one", (done) => {

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
          done();
        });
    });

    it("PUT should decrease the votes of an comment by one with down query", (done) => {

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
          done();
        });
    });

    /*** ERROR HANDLING */
    it("PUT updateCommentVote returns with error message if query provided was mispelled", (done) => {

      const commentId = docs.comments[0]._id;
    

      return request
        .put(`/api/articles/${commentId}?ote=up`)
        .expect(400)
        .then(res => {

          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Please provide a valid query, ie vote=up");
          done();
        });
    });

    /*** ERROR HANDLING */
    it("PUT updateCommentVote returns with error message if query value provided is invalid", (done) => {

      const commentId = docs.comments[0]._id;

      return request
        .put(`/api/comments/${commentId}?vote=banana`)
        .expect(400)
        .then(res => {

          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Please provide a valid query format,ie vote=up or vote=down");
          done();
        });
    });



    it("DELETE deletes a comment if its by user northcoder", (done) => {
      const commentId = docs.comments[0]._id;

      return request
        .delete(`/api/comments/${commentId}`)
        .expect(202)
        .then(res => {


          expect(res.body).to.be.an("object");
          done();
        });
    });
    //**ERROR HANDLING */
    it("DELETE returns status 404 - Unable to find comment to delete, check ID - if invalid ID is given", (done) => {
      const commentId = "5b81a5da18e8e60687fbc168";

      return request
        .delete(`/api/comments/${commentId}`)
        .expect(404)
        .then(res => {

          expect(res.body.message).to.be.equal("Unable to find comment to delete, check ID");
          done();
        });
    });
  });


});


