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

                    expect(res.body).to.be.an('object');
                    expect(res.body.articles.length).to.equal(2);
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
                    expect(res.body).to.be.an('object');
                    expect(res.body.comments.length).to.equal(2);
                    return;
                });
        });

        it('GET getArticleById returns the article of Id provided', () => {

            const articleId = docs.articles[0]._id;

            return request

                .get(`/api/articles/${articleId}`)
                .expect(200)
                .then(res => {

                    expect(res.body.article).to.be.an('object');
                    return;
                });

        });

        /*** ERROR HANDLING */
        it('GET article by ID with non existent ID returns status 404', () => {

            const articleId = "5a7d980c6a5d660aecab81d0"

            return request

                .get(`/api/articles/${articleId}/comments`)
                .expect(404)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.message).to.equal('Not found');
                    return;
                });

        });


        /*** ERROR HANDLING */
        it('GET article by ID with wrong article ID returns status 400', () => {

            const articleId = "banana"

            return request

                .get(`/api/articles/${articleId}/comments`)
                .expect(400)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.message).to.equal('Invalid ID.');
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
            .expect(201)
            .then(res => {

                expect(res.body).to.be.an('object')
                expect(res.body.body).to.equal("this is a new comment")
                return request
                    .get(`/api/articles/${articleId}/comments`)
                    .then(res => {

                        expect(res.body.comments.length).to.equal(3);
                        return;
                    })
            });

    });
    /*** ERROR HANDLING */
    it('POST does not post a new comment if the article ID provided is nonexistent ', () => {

        const articleId = "5a7d980c6a5d660aecab81d0"

        return request

            .post(`/api/articles/${articleId}/comments`)
            .send({
                comment: "this is a new comment"
            })
            .expect(404)
            .then(res => {

                expect(res.body).to.be.an('object')
                expect(res.body.message).to.equal("Article not found, check ID")
            });

    });

    describe('/api/articles/:article_id', () => {
        it('PUT should increase the votes of an article by one', () => {

            const articleId = docs.articles[0]._id;
            const votes = docs.articles[0].votes;

            return request
                .put(`/api/articles/${articleId}?vote=up`)
                .expect(202)
                .then(res => {

                    expect(res.body).to.be.an('object')

                    return request
                        .get(`/api/articles/${articleId}`)
                }).then(res => {

                    expect(res.body.article.votes).to.equal(1);
                })
        })
        /*** ERROR HANDLING */
        it('PUT returns with error message if query provided was mispelled', () => {

            const articleId = docs.articles[0]._id;
            const votes = docs.articles[0].votes;

            return request
                .put(`/api/articles/${articleId}?ote=up`)
                .expect(400)
                .then(res => {

                    expect(res.body).to.be.an('object')
                    expect(res.body.message).to.equal("Please provide a valid query, ie vote=up")
                });
        })
    })
    /*** ERROR HANDLING */
    it('PUT returns with error message if query value provided is invalid', () => {

        const articleId = docs.articles[0]._id;
        const votes = docs.articles[0].votes;

        return request
            .put(`/api/articles/${articleId}?vote=banana`)
            .expect(400)
            .then(res => {

                expect(res.body).to.be.an('object')
                expect(res.body.message).to.equal("Please provide a valid query format,ie vote=up or vote=down")

            })
    })

    it('PUT should decrease the votes of an article by one with down query', () => {

        const articleId = docs.articles[0]._id;
        const votes = docs.articles[0].votes;

        return request
            .put(`/api/articles/${articleId}?vote=down`)
            .expect(202)
            .then(res => {

                expect(res.body).to.be.an('object')

                return request
                    .get(`/api/articles/${articleId}`)
            }).then(res => {
                expect(res.body.article.votes).to.equal(-1);
            })
    })

    it('PUT should increase the votes of an comment by one', () => {

        const commentId = docs.comments[0]._id;
        const votes = docs.comments[0].votes;

        return request
            .put(`/api/comments/${commentId}?vote=up`)
            .expect(202)
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
            .expect(202)
            .then(res => {

                expect(res.body).to.be.an('object')

                return request
                    .get(`/api/comments/${commentId}`)
            }).then(res => {
                expect(res.body.votes).to.equal(-1);
            })
    });

    /*** ERROR HANDLING */
    it.only('PUT updateCommentVote returns with error message if query provided was mispelled', () => {

        const commentId = docs.comments[0]._id;
        const votes = docs.comments[0].votes;

        return request
            .put(`/api/articles/${commentId}?ote=up`)
            .expect(400)
            .then(res => {

                expect(res.body).to.be.an('object')
                expect(res.body.message).to.equal("Please provide a valid query, ie vote=up")
            });
    })

    /*** ERROR HANDLING */
    it.only('PUT updateCommentVote returns with error message if query value provided is invalid', () => {

        const commentId = docs.comments[0]._id;
        const votes = docs.comments[0].votes;

        return request
            .put(`/api/comments/${commentId}?vote=banana`)
            .expect(400)
            .then(res => {

                expect(res.body).to.be.an('object')
                expect(res.body.message).to.equal("Please provide a valid query format,ie vote=up or vote=down")

            })
    })

    describe('/api/users/:username', () => {
        it('returns details of the user required', () => {
            return request
                .get('/api/users/northcoder')
                .expect(200)
                .then(res => {

                    expect(res.body).be.an('object')
                    expect(res.body.username).to.equal('northcoder')
                    expect(res.body.name).to.equal('Awesome Northcoder')

                })
        });
    })

    describe('api/comments/:comment_id', () => {
        it('deletes a comment if its by user northcoder', () => {
            const commentId = docs.comments[0]._id;

            return request
                .delete(`/api/comments/${commentId}`)
                .expect(202)
                .then(res => {


                    expect(res.body).to.be.an('object');

                    return request
                        .get(`/api/comments/${commentId}`)
                        .then(res => {

                            expect(res.body).to.eql({});
                        })
                })
        });
    })

});