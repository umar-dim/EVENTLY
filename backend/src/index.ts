import express, { Express, Request, response, Response } from "express";
import { request } from "http";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as mongoDB from "mongodb";
import serverless from "serverless-http";
import cors from "cors";
import { users } from "./models/users";

const app: Express = express();
dotenv.config();
const port = process.env.PORT || 3000;
const url = process.env.DATABASE_URL || "empty";

async function connectdb() {
  await mongoose.connect(url);
}
async function fetchUsers() {
  try {
    const userList = await users.find(); // Await the operation
    console.log(userList);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

connectdb()
  .then(() => {
    console.log("we connected");
    fetchUsers();
  })
  .catch((err) =>
    console.log(`it doesnt work error is ${err} and url is ${url}`)
  );

// Call the function to fetch users

app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.json("Hello this is my get req!");
});

app.listen(port, () => {
  console.log(`App is running at ${port} `);
});

//line in order to make server serverless and be used on AWS lambda
//fyi it looks like it works on aws just have to add you to the org
//also have to give you credentials
//pretty sure you have to comment this out and uncomment out the app.listen code to test locally
// module.exports.handler = serverless(app);
