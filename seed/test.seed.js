const { Users, Comments, Topics, Articles } = require('../models/models');

const savedData = {};

function saveUser() {
    const user = new Users({
        username: 'northcoder',
        name: 'Awesome Northcoder',
        avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200',
    });
    return user.save();
}

function saveTopics() {
    const topics = [
        { title: 'Football', slug: 'football' },
        { title: 'Cooking', slug: 'cooking' },
        { title: 'Cats', slug: 'cats' },
    ].map((t) => new Topics(t).save());
    return Promise.all(topics);
}

function saveArticles() {
    const articles = [
        { title: 'Cats are great', body: 'something', belongs_to: 'cats', votes: 0 },
        { title: 'Football is fun', body: 'something', belongs_to: 'football', votes: 0 },
    ].map((a) => new Articles(a).save());
    return Promise.all(articles);
}

function saveComments(articles) {
    const comments = [
        { body: 'this is a comment', belongs_to: articles[0]._id, created_by: 'northcoder', votes: 0 },
        { body: 'this is another comment', belongs_to: articles[0]._id, created_by: 'northcoder', votes: 0 },
    ].map((c) => new Comments(c).save());
    return Promise.all(comments);
}

function saveTestData() {
    return saveUser()
        .then((user) => {
            savedData.user = user;
            return saveTopics();
        })
        .then((topics) => {
            savedData.topics = topics;
            return saveArticles();
        })
        .then((articles) => {
            savedData.articles = articles;
            return saveComments(articles);
        })
        .then((comments) => {
            savedData.comments = comments;
            return savedData;
        });
}

module.exports = saveTestData;
