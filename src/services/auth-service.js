import { validation } from "../validation/validation.js";
import {
  loginUserValidation,
  getUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../apps/db.js";
import bcrypt from "bcrypt";
import { ResponseError } from "../errors/response-error.js";
import jwt from "jsonwebtoken";

const register = async (request) => {
  const user = validation(registerUserValidation, request);

  const emailExist = await prismaClient.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (emailExist) {
    throw new ResponseError(400, "Email already exist");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      name: true,
      username: true,
      email: true,
      photo: true,
    },
  });
};

const login = async (request) => {
  const user = validation(loginUserValidation, request);

  const userExist = await prismaClient.user.findFirst({
    where: {
      username: user.username,
    },
  });

  if (
    !userExist ||
    !(await bcrypt.compare(user.password, userExist.password))
  ) {
    throw new ResponseError(400, "Username or password is wrong");
  }

  return jwt.sign(
    {
      id: userExist.id,
      username: userExist.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 15,
    }
  );
};

const logout = async (request) => {
  const userId = validation(getUserValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExist) {
    throw new ResponseError(401, "You are not logged in");
  }

  return userId;
};

export default { register, login, logout };
