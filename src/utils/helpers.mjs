import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  console.log("salt é", salt);
  //como tá no return, não precisa de await
  return bcrypt.hash(password, salt);
};

export const comaparePassword = async (plain, hashed) => {
  //como tá no return, não precisa de await
  return bcrypt.compare(plain, hashed);
};
