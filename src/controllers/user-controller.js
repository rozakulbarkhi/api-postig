import userService from "../services/user-service.js";

const get = async (req, res, next) => {
  try {
    const data = await userService.get(req.userId);

    res.status(200).json({
      success: true,
      message: "Successfully Get User",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await userService.update(req.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Successfully Update User",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const data = await userService.changePassword(req.userId, req.body);
    console.log(data);

    res.status(200).json({
      success: true,
      message: "Successfully Change Password",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export default { get, update, changePassword };
