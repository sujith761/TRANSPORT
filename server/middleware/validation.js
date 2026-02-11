const Joi = require('joi');

exports.validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    registerNumber: Joi.string().required().uppercase().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
    department: Joi.string().required(),
    city: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

exports.validateTransportApplication = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    registerNumber: Joi.string().required(),
    department: Joi.string().required(),
    academicYear: Joi.string().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    applicationType: Joi.string().valid('new', 'change', 'cancel').required(),
    // 'route' is required only for 'new' applications
    route: Joi.string().when('applicationType', {
      is: 'new',
      then: Joi.string().required(),
      otherwise: Joi.string().allow('', null)
    }),
    // 'currentRoute' is required for 'change' and 'cancel'
    currentRoute: Joi.string().when('applicationType', {
      is: Joi.valid('change', 'cancel'),
      then: Joi.string().required(),
      otherwise: Joi.string().allow('', null)
    }),
    // 'newRoute' is required for 'change'
    newRoute: Joi.string().when('applicationType', {
      is: 'change',
      then: Joi.string().required(),
      otherwise: Joi.string().allow('', null)
    }),
    reason: Joi.string().when('applicationType', {
      is: Joi.valid('change', 'cancel'),
      then: Joi.string().required(),
      otherwise: Joi.string().allow('', null)
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};
