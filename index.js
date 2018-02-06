const app = require('./server');
const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

