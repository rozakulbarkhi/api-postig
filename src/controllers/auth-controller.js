import authService from "../services/auth-service.js";

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Your account has been successfully created",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    res.cookie("token", data, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
    });

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        token: data,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.userId);

    res.clearCookie("token", {
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Successfully logout",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export default { register, login, logout };
