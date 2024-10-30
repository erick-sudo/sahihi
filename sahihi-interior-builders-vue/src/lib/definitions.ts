import Joi from "joi";
import { Ref } from "vue";

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

export type Role = GrantedAuthority;

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

export interface Customer extends Entity, TimeStamps {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export enum LeadStatus {
  New = "New",
  Contacted = "Contacted",
  Qualified = "Qualified",
  Proposal = "Proposal",
  Negotiation = "Negotiation",
  Won = "Won",
  Lost = "Lost",
  Disqualified = "Disqualified",
}

export interface Lead extends Entity, TimeStamps {
  customerId: string;
  status: LeadStatus;
}

export type InteractionType =
  | "PhoneCall"
  | "Email"
  | "Meeting"
  | "Demo"
  | "FollowUp"
  | "SocialMedia"
  | "TextMessage";

export interface Interaction extends Entity, TimeStamps {
  leadId: string;
  type: InteractionType;
  details: string;
  date: string;
}

export interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export const customerSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "string.empty": "Customer name is required" }),
  email: Joi.string()
    .email({
      tlds: { allow: false },
    })
    .required()
    .messages({ "string.email": "Invalid email address" }),
  phone: Joi.string()
    .pattern(/^\+254\d{9}$/)
    .messages({ "string.pattern.base": "A valid phone number is required" }),
  company: Joi.string().optional,
});

export const validateForm = ({
  value,
  schema,
  errors,
}: {
  value: any;
  schema: Joi.ObjectSchema<any>;
  errors: Ref<Record<string, string>, Record<string, string>>;
}) => {
  const { error } = schema.validate(value, { abortEarly: false });

  if (error) {
    errors.value = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {} as Record<string, string>);

    return false;
  }

  errors.value = {};
  return true;
};
