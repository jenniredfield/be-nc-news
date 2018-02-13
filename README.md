Northcoders News is an interactive full stack news website. This API was made with Node.js, Express.js and MongoDB serving the database.

In order to download and run this project, it is necessary to have installed Node.js, npm and MongoDB on your computer.

To check if you have Node type on your terminal:

```
node -v
```

You can download Node [here](https://nodejs.org/en/download/)

When you download Node, you should also get npm with it.

To check if you have Mongo
```
mongo -v
```
Download MongoDB [here](https://docs.mongodb.com/manual/administration/install-community/)

# To download and use this project: 

- Open your terminal and navigate to the folder where you want to copy this project
```
git clone https://github.com/jenniredfield/BE-NC-News-Feb.git
```
Navigate to folder:
```
cd BE-NC-News-Feb 
```
## Install dependencies:
```
npm install
```
## To run server locally:
```
npm run dev
```
## To run tests
Run mongo on your terminal
```
mongod
```
Making sure you are on the project folder, on your terminal type:
```
npm  test
```
# API Routes
```
GET /api/topics
```
Get all the topics
```
GET /api/topics/:topic_id/articles
```
Return all the articles for a certain topic
```
GET /api/articles
```
Returns all the articles
```
GET /api/articles/:article_id
```
Returns a JSON object with the article information for the specified article
```
GET /api/articles/:article_id/comments
```
Get all the comments for an individual article
```
POST /api/articles/:article_id/comments
```
Add a new comment to an article. This route requires a JSON body with a comment key and value pair e.g: {"comment": "This is my new comment"}
```
PUT /api/articles/:article_id
```
Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down' e.g: /api/articles/:article_id?vote=up
```
PUT /api/comments/:comment_id
```
Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down' e.g: /api/comments/:comment_id?vote=down
```
DELETE /api/comments/:comment_id
```
Deletes a comment
```
GET /api/users
```
Returns all users
```
GET /api/users/:username
```
Returns a JSON object with the profile data for the specified user.
