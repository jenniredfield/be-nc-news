/* eslint-disable no-console */

const app = require("./server");
const PORT = process.env.PORT || 3000;
console.log(PORT);

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

