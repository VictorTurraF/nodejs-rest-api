const { cpf } = require("cpf-cnpj-validator");
const { checkSchema, validationResult } = require("express-validator");

const wasPassed = (value) => value != undefined && value != null;

const required = {
  nome: {
    isEmpty: {
      errorMessage: "Nome é obrigatório",
      negated: true,
      bail: true,
    },
  },
  cidade: {
    isEmpty: {
      errorMessage: "Cidade é obrigatório",
      negated: true,
      bail: true,
    },
  },
  curso: {
    isEmpty: {
      errorMessage: "Curso é obrigatório",
      negated: true,
      bail: true,
    },
  },
  ra: {
    isEmpty: {
      errorMessage: "R.A. é obrigatório",
      negated: true,
      bail: true,
    },
  },
  cpf: {
    isEmpty: {
      errorMessage: "CPF é obrigatório",
      negated: true,
      bail: true,
    },
  },
  semestre: {
    isEmpty: {
      errorMessage: "Semestre é obrigatório",
      negated: true,
      bail: true,
    },
  },
};

const validated = {
  nome: {
    isLength: {
      errorMessage: "Nome deve ter entre 3 a 65 caracteres",
      bail: true,
      options: {
        min: 3,
        max: 65,
      },
      if: wasPassed,
    },
  },
  cidade: {
    isLength: {
      errorMessage: "Cidade deve ter entre 3 a 65 caracteres",
      bail: true,
      options: {
        min: 3,
        max: 65,
      },
      if: wasPassed,
    },
  },
  curso: {
    isLength: {
      errorMessage: "Curso deve ter entre 3 a 65 caracteres",
      bail: true,
      options: {
        min: 3,
        max: 65,
      },
      if: wasPassed,
    },
  },
  ra: {
    custom: {
      options: function (value) {
        return typeof value === "number";
      },
      bail: true,
      errorMessage: "R.A Deve ser número",
      if: wasPassed,
    },
    isLength: {
      errorMessage: "R.A deve ter 6 dígitos",
      bail: true,
      options: {
        min: 6,
        max: 6,
      },
      if: wasPassed,
    },
  },
  cpf: {
    custom: {
      options: function (value) {
        if (typeof value !== "number") throw new Error("CPF Deve ser número");

        if (!cpf.isValid(String(value))) throw new Error("CPF Deve ser válido");

        return true;
      },
      bail: true,
      if: wasPassed,
    },
  },
  semestre: {
    custom: {
      options: function (value) {
        if (typeof value !== "number")
          throw new Error("Semestre Deve ser número");

        if (!(value > 0 && value <= 8))
          throw new Error("Semestre deve ser de 1 a 8");

        return true;
      },
      bail: true,
      if: wasPassed,
    },
  },
};

const ensureOnlyValidation = checkSchema({
  nome:     { in: ["body"], ...validated.nome },
cidade:     { in: ["body"], ...validated.cidade },
  curso:    { in: ["body"], ...validated.curso },
  ra:       { in: ["body"], ...validated.ra },
  cpf:      { in: ["body"], ...validated.cpf },
  semestre: { in: ["body"], ...validated.semestre },
});

const ensureValidationAndRequire = checkSchema({
  nome:     { in: ["body"], ...required.nome, ...validated.nome },
  cidade:   { in: ["body"], ...required.cidade, ...validated.cidade },
  curso:    { in: ["body"], ...required.curso, ...validated.curso },
  ra:       { in: ["body"], ...required.ra, ...validated.ra },
  cpf:      { in: ["body"], ...required.cpf, ...validated.cpf },
  semestre: { in: ["body"], ...required.semestre, ...validated.semestre },
});

function handleErros(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  return next();
}

const fillable = ["nome", "cidade", "curso", "cpf", "ra", "semestre"];
function ensureOnlyPermitedFields(req, res, next) {
  const bodyKeys = Object.keys(req.body || {});

  if (bodyKeys.length < 1)
    return res.status(422).json({ message: "JSON vazio" });

  if (!bodyKeys.every((key) => fillable.includes(key)))
    return res.status(422).json({
      message:
        "Algum campo informado não é permitido, válidos apenas: " +
        fillable.map((key) => `'${key}'`).join(","),
    });

  return next();
}

module.exports = {
  ensureValidationAndRequireds,
  ensureOnlyValidation,
  ensureOnlyPermitedFields,
  handleErros,
};
