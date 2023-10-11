// get port # from config.env
require("dotenv").config();

// create express process?
const express = require("express");
const app = express();
// const cors = require("cors");

// app.use(cors());
// app.use(express.json());
// app.use(require("./routes/record"));
// // get driver connection
// const dbo = require("./db/conn");
// app.listen(port, () => {
//   // perform a database connection when server starts
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
//    });
//   console.log(`Server is running on port: ${port}`);
// });
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get('/', (req, res) => {
  res.json({msg: "welcoem to the app"});
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});