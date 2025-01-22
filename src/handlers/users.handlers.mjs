import { mockUsers } from "../utils/constants.mjs";
import { User } from "../moongose/schemas/user.model.mjs";

import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";

export const getUserByIdHandler = (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers.find((user) => user.id === findUserIndex + 1);

  if (!findUser) {
    return res.sendStatus(404);
  }

  return res.send(findUser);
};

export const createUserHandler = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send(result.array());
  }

  const data = matchedData(req);
  data.password = await hashPassword(data.password);
  const newUser = new User(data);

  try {
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
