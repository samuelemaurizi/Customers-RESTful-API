const config = require("./config");
const mongoose = require("mongoose");
const restify = require("restify");
const restifyjwt = require("restify-jwt-community");

// Initialize Restify
const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// Protect ALL the Routes
// server.use(
//   restifyjwt({ secret: config.JWT_SECRET }).unless({ path: ["/auth"] })
// );

server.listen(config.PORT, () => {
  // Fix the deprecation warning for findOneAndUdate method
  mongoose.set("useFindAndModify", false);
  // Connect to mongodb
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});

// Initialize Mongodb connection
const db = mongoose.connection;
// Handle Mongodb errors
db.on("error", err => console.log(err));
// Handle the Opening DB
db.once("open", () => {
  require("./routes/customers")(server);
  require("./routes/users")(server);
  console.log(`Server started on port ${config.PORT}`);
});
