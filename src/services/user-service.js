import { prismaClient } from "../apps/db.js";
import { ResponseError } from "../errors/response-error.js";
import {
  changePasswordValidation,
  getUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validation } from "../validation/validation.js";
import bcrypt from "bcrypt";

const get = async (request) => {
  const userRequest = validation(getUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      id: userRequest,
    },
    select: {
      name: true,
      username: true,
      email: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return user;
};

const update = async (user, request) => {
  const userReq = validation(updateUserValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  return prismaClient.user.update({
    where: {
      id: user,
    },
    data: {
      name: userReq.name,
      username: userReq.username,
      email: userReq.email,
      photo: userReq.photo,
    },
    select: {
      name: true,
      username: true,
      email: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const changePassword = async (user, request) => {
  const userReq = validation(changePasswordValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  const checkOldPassword = await bcrypt.compare(
    userReq.oldPassword,
    userExist.password
  );

  if (!checkOldPassword) {
    throw new ResponseError(400, "Password was wrong");
  }

  if (userReq.newPassword !== userReq.confirmNewPassword) {
    throw new ResponseError(400, "Password not match");
  }

  if (userReq.oldPassword === userReq.newPassword) {
    throw new ResponseError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  const newPassword = await bcrypt.hash(userReq.newPassword, 10);

  return prismaClient.user.update({
    where: {
      id: user,
    },
    data: {
      password: newPassword,
    },
  });
};

export default { get, update, changePassword };
