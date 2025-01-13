import { mockUsers } from "./constants.mjs";

export const resolveIndexUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request. Invalid Id" });
  }

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }

  req.findUserIndex = findUserIndex;
  next();
};
