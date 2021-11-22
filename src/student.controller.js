const { HTTP_OK, HTTP_CREATED, HTTP_NO_CONTENT } = require("./http");
const service = require("./student.service");

function index(req, res) {
  const students = service.findAll();

  return res.status(HTTP_OK).json(students);
}


function show(req, res) {
  const { student } = req;

  return res.status(HTTP_OK).json(student);
}


function create(req, res) {
  const student = service.create(req.body);

  return res.status(HTTP_CREATED).json(student);
}


function update(req, res) {
  const { student } = req;

  const updatedStudent = service.updateById(student.id, req.body);

  return res.status(HTTP_OK).json(updatedStudent);
}


function destroy(req, res) {
  const { student } = req;

  service.deleteById(student.id);

  return res.status(HTTP_NO_CONTENT).json({});
}


module.exports = { index, show, create, update, destroy };
