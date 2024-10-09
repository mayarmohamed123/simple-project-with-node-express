const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage(" The title is required")
      .isLength({ min: 2 })
      .withMessage("title at least is 2-digits"),
    body("price").notEmpty().withMessage("The price is required"),
  ];
};

module.exports = {
  validationSchema,
};
