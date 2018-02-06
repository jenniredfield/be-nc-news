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

});