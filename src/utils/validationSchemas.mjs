export const createUserValidationScehame = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username tem que ser entre 5 e 32",
    },
    notEmpty: {
      errorMessage: "Username não pode ser vazio",
    },
    isString: {
      errorMessage: "Username tem que ser txto",
    },
  },
  displayName: {
    notEmpty: true,
  },
};
