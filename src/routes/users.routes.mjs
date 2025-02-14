import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationScehame } from "../utils/validationSchemas.mjs";
import { resolveIndexUserId } from "../utils/middlewares.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../moongose/schemas/user.model.mjs";
import {
  createUserHandler,
  getUserByIdHandler,
} from "../handlers/users.handlers.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Não pode ser vazia")
    .isLength({ min: 3, max: 10 })
    .withMessage("Tamanho não está entre 3 e 10"),
  (req, res) => {
    // console.log(req["express-validator#contexts"]);
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("inside session store get");
      console.log(sessionData);
    });

    const result = validationResult(req);
    console.log(result);

    const {
      query: { filter, value },
    } = req;

    //when filter and value are undefined
    if (!filter && !value) {
      return res.send(mockUsers);
    }

    if (filter && value) {
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    }

    return res.send(mockUsers);
  }
);

// router.post(
//   "/api/users",
//   checkSchema(createUserValidationScehame),
//   (req, res) => {
//     const { body } = req;
//     console.log(body);

//     const result = validationResult(req);

//     if (!result.isEmpty()) {
//       return res.status(400).send({ errors: result.array() });
//     }

//     const data = matchedData(req);
//     const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
//     mockUsers.push(newUser);
//     return res.status(201).send(newUser);
//   }
// );

router.post(
  "/api/users",
  checkSchema(createUserValidationScehame),
  createUserHandler
);

router.get("/api/users/:id", resolveIndexUserId, getUserByIdHandler);

router.put("/api/users/:id", resolveIndexUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(204);
});

router.patch("/api/users/:id", resolveIndexUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(204);
});

router.delete("/api/users/:id", resolveIndexUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex);
  return res.sendStatus(200);
});

export default router;
