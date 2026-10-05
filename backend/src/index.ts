import "dotenv/config";
import Debug from "debug";
import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import { PORT } from "./utils/env.js";
import {
  zUsersRes,
  zUsersWrongRes,
  zUsersCreateReq,
  type UserCreateReq,
} from "./schema.js";
import { validateData } from "./validation.js";
import { nanoid } from "nanoid";
import { initData } from "./utils/initData.js";

const debug = Debug("myapp");
const app = express();
app.use(cors({ origin: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let data = [...initData];

// * Endpoint: get users
app.get("/users", (req, res) => {
  // The response should not contain passwords.
  res.json(zUsersRes.parse(data));
});

// * Endpoint: get users (wrong format)
app.get("/users_wrong", (req, res) => {
  const dataNew = data.map((d) => {
    const { firstName, lastName, dateOfBirth, ...rest } = d;
    return {
      ...rest,
      firstname: firstName,
      lastname: lastName,
      dateOfBirth: dayjs(dateOfBirth).add(543, "year").format("YYYY-MM-DD"),
    };
  });
  // The response should not contain passwords.
  res.send(zUsersWrongRes.parse(dataNew));
});

// * Endpoint: create user
app.post("/users", validateData(zUsersCreateReq), async (req, res, next) => {
  setTimeout(() => {
    const { confirmPassword, ...rest } = req.body as UserCreateReq;
    // This will fail if undefined.
    debug(rest.firstName.toUpperCase());
    debug(rest.lastName.toUpperCase());
    debug(rest.password.toUpperCase());
    debug(rest.dateOfBirth.toUpperCase());
    debug(rest.email.toUpperCase());
    // Add user
    const newData = {
      id: nanoid(),
      createdAt: new Date().getTime(),
      ...rest,
    };
    data = [newData, ...data];
    return res.send({ status: "success" });
  }, 2000);
});

// * Endpoint: reset user
app.post("/users/reset", async (req, res, next) => {
  data = [...initData];
  return res.send({ status: "success" });
});

// * Endpoint: hello world
app.get("/", (req, res, next) => res.send("It is working!"));

// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
