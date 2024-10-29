import Joi from "joi";

export interface Entity {
  id: string;
}

export interface Principal extends Entity {
  email: string;
}

export interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

export interface GrantedAuthority extends Entity, TimeStamps {
  name: string;
}

export type Role = GrantedAuthority

// Authentication context
export interface AuthenticationContext {
  principal: Principal;
  authorities: GrantedAuthority[];
}

export interface User extends Entity, TimeStamps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  kraPin: string;
  kraAttachment?: string;
}

export interface BriefUser extends Entity {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Project extends Entity, TimeStamps {
  name: string;
  description?: string;
}

export interface ProjectAssignment extends Entity {
  userId: string;
  projectId: string;
  roleId: string;
  assignedAt: string;
}

export interface ProjectAssignmentDetails {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  assignmentId: string;
  assignedAt: string;
  roleId: string;
  roleName: string;
  projectId: string;
  projectName: string;
}

export interface SignupForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  kraPin: string;
  kraAttachment: string | null;
  password: string;
  confirmPassword: string;
}

export const baseSignupSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .messages({ "any.required": "First name is required" }),
  lastName: Joi.string()
    .required()
    .messages({ "any.required": "Last name is required" }),
  phoneNumber: Joi.string()
    .pattern(/^\+254\d{9}$/)
    .messages({ "string.pattern.base": "A valid phone number is required" }),
  address: Joi.string()
    .required()
    .messages({ "any.required": "Address is required" }),
  email: Joi.string()
    .email({
      tlds: { allow: false },
    })
    .required()
    .messages({ "string.email": "Invalid email address" }),
  kraPin: Joi.string()
    .required()
    .messages({ "any.required": "KRA pin is required" }),
  kraAttachment: Joi.string().allow(null, ""),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "string.min": "Weak password" }),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});
