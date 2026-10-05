import "dotenv/config";
import Debug from "debug";
import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import { PORT, NODE_ENV } from "./utils/env.js";
import { getOpenApiDocumentation, writeDocumentation } from "./openAPI.js"; // Note that this line needs to come before import from schema.js due to extendZodWithOpenApi(z) line.
import {
  zUsersRes,
  zUsersWrongRes,
  zUsersCreateReq,
  zUsersCreateRes,
  zUsersResetRes,
  type UserCreateReq,
} from "./schema.js";
import { validateData } from "./validation.js";
import { nanoid } from "nanoid";
import swaggerUi from "swagger-ui-express";
import { initData } from "./utils/initData.js";
import { registry } from "./openAPI.js";

const debug = Debug("myapp");
const app = express();
app.use(cors({ origin: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let data = [...initData];

// * Endpoint: get users
registry.registerPath({
  method: "get",
  path: "/users",
  description: "Get all users",
  summary: "Get all users",
  tags: ["Right"],
  responses: {
    200: {
      description: "User data array",
      content: {
        "application/json": {
          schema: zUsersRes,
        },
      },
    },
  },
});
app.get("/users", (req, res) => {
  // The response should not contain passwords.
  res.json(zUsersRes.parse(data));
});

// * Endpoint: get users (wrong format)
registry.registerPath({
  method: "get",
  path: "/users_wrong",
  description: "Get all users",
  summary: "Get all users",
  tags: ["Wrong"],
  responses: {
    200: {
      description: "User data array",
      content: {
        "application/json": {
          schema: zUsersWrongRes,
        },
      },
    },
  },
});
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
registry.registerPath({
  method: "post",
  path: "/users",
  description: "Create user",
  summary: "Create user",
  tags: ["Right"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: zUsersCreateReq,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Reset sucessfully",
      content: {
        "application/json": {
          schema: zUsersCreateRes,
        },
      },
    },
  },
});
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
registry.registerPath({
  method: "post",
  path: "/users/reset",
  description: "Reset users to initial data",
  summary: "Reset users to initial data",
  tags: ["Utility"],
  responses: {
    200: {
      description: "Reset sucessfully",
      content: {
        "application/json": {
          schema: zUsersResetRes,
        },
      },
    },
  },
});
app.post("/users/reset", async (req, res, next) => {
  data = [...initData];
  return res.send({ status: "success" });
});

// * Endpoint: hello world
app.get("/", (req, res, next) => res.send("It is working!"));

// * Endpoints: swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(getOpenApiDocumentation())
);
if (NODE_ENV === "development") writeDocumentation();

// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
