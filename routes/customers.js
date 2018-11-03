const errors = require("restify-errors");
const restifyjwt = require("restify-jwt-community");
const config = require("../config");
const Customer = require("../models/Customer");

// Routes handler
module.exports = server => {
  // //////////////////////////////////////////////////
  // GET ALL
  server.get("/customers", async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      // Restify needs always next()
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // //////////////////////////////////////////////////
  // GET ONE
  server.get("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id of ${req.params.id}`
        )
      );
    }
  });

  // //////////////////////////////////////////////////
  // POST
  // with Middleware restifyjwt()
  server.post(
    "/customers",
    restifyjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError(" Expect 'application/json' ")
        );
      }

      // Create New one
      const { name, email, balance } = req.body;
      const customer = new Customer({
        name,
        email,
        balance
      });

      // Save in db
      try {
        const newCustomer = await customer.save();
        res.send(201);
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // /////////////////////////////////////////////////
  // PUT
  // with AUTH Middleware restifyjwt()
  server.put(
    "/customers/:id",
    restifyjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Chech for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError(" Expect 'application/json' ")
        );
      }

      try {
        const customer = await Customer.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no customer with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  // /////////////////////////////////////////////////
  // DELETE
  // with AUTH Middleware restifyjwt()
  server.del(
    "/customers/:id",
    restifyjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const customer = await Customer.findOneAndRemove({
          _id: req.params.id
        });
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no customer with the id of ${req.params.id}`
          )
        );
      }
    }
  );
};
