const Joi = require("joi");

const UserRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).unknown(true);

const UserLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(true);

const CompanySchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
}).unknown(true);

const CategorySchema = Joi.object({
  name: Joi.string().required(),
}).unknown(true);

const JobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  company_id: Joi.string().optional(),
  category_id: Joi.string().optional(),
}).unknown(true);

const ApplicationSchema = Joi.object({
  job_id: Joi.string().optional(),
  jobId: Joi.string().optional(),
}).unknown(true);

const ApplicationStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "accepted", "rejected").required(),
}).unknown(true);

const BookmarkSchema = Joi.object({
  job_id: Joi.string().required(),
}).unknown(true);

const DocumentSchema = Joi.object({
  filename: Joi.string().required(),
  path: Joi.string().required(),
}).unknown(true);

const RefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).unknown(true);

module.exports = { UserRegisterSchema, UserLoginSchema, CompanySchema, CategorySchema, JobSchema, ApplicationSchema, ApplicationStatusSchema, BookmarkSchema, DocumentSchema, RefreshTokenSchema };
