const { HTTP_NOT_FOUND } = require("./http");
const service = require("./student.service");

function handleStudentIdParameter(req, res, next) {
  const { student_id } = req.params;

  const foundStudent = service.findById(student_id);
  if (!foundStudent) {
    return res
      .status(HTTP_NOT_FOUND)
      .json({ message: "Aluno não encontrado" });
  }

  req.student = foundStudent;

  return next();
}

module.exports = { handleStudentIdParameter };
