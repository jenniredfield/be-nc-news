process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const seed = require('../seed/test.seed');
const mongoose = require('mongoose');
const server = require('../server');
const request = require('supertest')(server);
const bodyParser = require('body-parser');

console.log(process.env.NODE_ENV)

describe('API endpoints', () => {
    let docs = {};

    beforeEach(function () {

        return mongoose.connection.dropDatabase()
            .then(() => {
                return seed()
            })
            .then(data => {
             
                docs = data;
            })

    });

    after(function () {

        return mongoose.disconnect();
    })


    describe('/articles', () => {
        it('GET should return all of the articles contained in the database', () => {
            return request
                .get('/api/articles')
                .expect(200)
                .then(res => {

                    expect(res.body).to.be.an('Array');
                    expect(res.body.length).to.equal(2);
                    return;
                });

        });
    });

    describe('/articles/:article_id/comments', () => {
        it('GET should return all of the comments from the article with the ID provided', () => {

            const articleId = docs.articles[0]._id;

            return request

                .get(`/api/articles/${articleId}/comments`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Array');
                    expect(res.body.length).to.equal(2);
                    return;
                });

        });

    });

    it('POST should post a new comment on the article from ID provided', () => {

        const articleId = docs.articles[0]._id;

        return request

            .post(`/api/articles/${articleId}/comments`)
            .send({
                comment: "this is a new comment"
            })
            .expect(200)
            .then(res => {

                expect(res.body).to.be.an('object')
                expect(res.body.body).to.equal("this is a new comment")
                return request
                    .get(`/api/articles/${articleId}/comments`)
                    .then(res => {

                        expect(res.body.length).to.equal(3);
                        return;
                    })

            });

    });

    describe('/api/articles/:article_id', () => {
        it('PUT should increase the votes of an article by one', () => {

            const articleId = docs.articles[0]._id;
            const votes = docs.articles[0].votes;

            return request
                .put(`/api/articles/${articleId}?vote=up`)
                .then(res => {
                    
                    expect(res.body).to.be.an('array')
                 
                    return request
                        .get(`/api/articles/${articleId}`)
                }).then(res => {
                    expect(res.body.votes).to.equal(1);
                })
        })
    })

    it('PUT should decrease the votes of an article by one with down query', () => {

        const articleId = docs.articles[0]._id;
        const votes = docs.articles[0].votes;

        return request
            .put(`/api/articles/${articleId}?vote=down`)
            .then(res => {
                
                expect(res.body).to.be.an('array')
             
                return request
                    .get(`/api/articles/${articleId}`)
            }).then(res => {
                expect(res.body.votes).to.equal(-1);
            })
    })

    it('PUT should increase the votes of an comment by one', () => {

        const commentId = docs.comments[0]._id;
        const votes = docs.comments[0].votes;

        return request
            .put(`/api/comments/${commentId}?vote=up`)
            .then(res => {
                
                expect(res.body).to.be.an('object')
             
                return request
                    .get(`/api/comments/${commentId}`)
            }).then(res => {
                expect(res.body.votes).to.equal(1);
            })
    });

    it('PUT should decrease the votes of an comment by one with down query', () => {

        const commentId = docs.comments[0]._id;
        const votes = docs.comments[0].votes;

        return request
            .put(`/api/comments/${commentId}?vote=down`)
            .then(res => {
                
                expect(res.body).to.be.an('object')
             
                return request
                    .get(`/api/comments/${commentId}`)
            }).then(res => {
                expect(res.body.votes).to.equal(-1);
            })
    });

    describe('/api/users/:username', () => {
        it('returns details of the user required', () =>{


            return request
                    .get('/api/users/northcoder')
                    .then(res => {

                        expect(res.body).be.an('object')
                        expect(res.body.username).to.equal('northcoder')
                        expect(res.body.name).to.equal('Awesome Northcoder')
                      
                    })
        });
    })

    describe('api/comments/:comment_id', () => {
        it('deletes a comment if its by user northcoder', () =>{
            const commentId = docs.comments[0]._id;
         
            return request
                    .delete(`/api/comments/${commentId}`)
                    .then(res => {

             
                      expect(res.body).to.be.an('object');

                      return request
                      .get(`/api/comments/${commentId}`)
                      .then(res=> {
                        
                          expect(res.body).to.eql({});
                      })
                    })
        });
    })

});