import "reflect-metadata";
import express from "express";
import { config } from "dotenv";
import cors from "cors";

import { createConnection } from "typeorm";
import routes from "./api/routes";

config();

const app = express();
const port = process.env.PORT || 9090;
app.use(express.json());
app.use(cors());
routes(app);

createConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
