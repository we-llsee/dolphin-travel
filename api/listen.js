const app = require("./app.js");

const { PORT = 3030 } = process.env;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Now listening on port ${PORT}...`);
});
