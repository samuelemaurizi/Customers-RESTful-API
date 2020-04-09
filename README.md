# Customer API

> RESTful API built with Node.js, Mongoose, Restify and JWT. It uses 'jsonwebtoken' to create the token and restify-jwt-community to protect routes.

### API Endpoints

###### Customer Routes

- GET /customers
- GET /customers/:id
- POST (Protected) /customers
- PUT (Protected) /customers/:id
- DELETE (Protected) /customers/:id

###### User Routes

- POST /register
- POST /auth

###### Quick Start

```
Install dependencies
  npm install

Serve on localhost:3000
  npm run dev
```
