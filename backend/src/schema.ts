import { z } from "zod";
import dayjs from "dayjs";

const yearUpper = dayjs().year();
const yearLower = yearUpper - 100;

export const zUserBase = z.object({
  id: z.string().min(1, { message: "Missing ID" }),

  createdAt: z.number(),
  firstName: z
    .string()
    .min(1, { message: "Missing firstname" })
    .max(15, { message: "Firstname too long" }),
  lastName: z
    .string()
    .min(1, { message: "Missing lastname" })
    .max(15, { message: "Lastname too long" }),
  email: z
    .email({ message: "Invalid email" })
    .max(50, { message: "Email too long" }),
  dateOfBirth: z
    .string()
    .min(1, { message: "Missing date of birth" })
    .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, {
      message: "Use format YYYY-MM-DD.",
    })
    .refine(
      (s) => {
        const year = dayjs(s).year();
        if (year < yearLower || year > yearUpper) {
          return false; // Trigger error
        } else {
          return true;
        }
      },
      {
        message: `Year not between ${yearLower} to ${yearUpper}`,
      },
    ),
  password: z
    .string()
    .min(4, { message: "Password too short" })
    .max(20, { message: "Password too long" }),
});

// Get user
export const zUsersRes = z.array(zUserBase.omit({ password: true }));

// Create user
export const zUsersCreateReq = zUserBase
  .omit({ id: true, createdAt: true })
  .extend({
    confirmPassword: z.string().min(1, { message: "Confirm password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export const zUsersCreateRes = z.object({
  status: z.string(),
});
export type UserCreateReq = z.infer<typeof zUsersCreateReq>;

// Get user_wrong
export const zUsersWrongRes = z.array(
  zUserBase
    .omit({
      firstName: true,
      lastName: true,
      password: true,
      dateOfBirth: true,
    })
    .extend({
      firstname: z.string(),
      lastname: z.string(),
      dateOfBirth: z.string(),
    }),
);

// Reset
export const zUsersResetRes = zUsersCreateRes;
