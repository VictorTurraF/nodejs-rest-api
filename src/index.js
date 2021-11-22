const express = require("express");
const {
  ensureValidationAndRequireds,
  ensureOnlyValidation,
  ensureOnlyPermitedFields,
  handleErros,
  handleRequiredFields,
} = require("./student.request");
const { handleStudentIdParameter } = require("./student.middleware");
const controller = require("./student.controller");

const app = express();

app.use(express.json());
app.use(function (req, res, next) {
  res.set("access-control-allow-origin", "*");
  res.set("access-control-allow-headers", "*");
  res.set("access-control-allow-methods", "*");
  next();
});

app.param("student_id", handleStudentIdParameter);

app
  .route("/api/students/:student_id")
  .get(controller.show)
  .put(
    ensureOnlyPermitedFields,
    ensureOnlyValidation, 
    handleErros, 
    controller.update
  )
  .delete(controller.destroy);

app
  .route("/api/students")
  .post(
    ensureValidationAndRequireds, 
    handleErros, 
    controller.create
  )
  .get(controller.index);

app.listen(3333);
