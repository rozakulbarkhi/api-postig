import postService from "../services/post-service.js";

const create = async (req, res, next) => {
  try {
    const data = await postService.create(req.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Successfully Create Post",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.id = id;

    const data = await postService.update(req.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Successfully Update Post",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.id = id;

    await postService.deletePost(req.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Successfully Delete Post",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const like = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.id = id;

    await postService.like(req.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Successfully Liked Post",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const unlike = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.id = id;

    await postService.unlike(req.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Successfully Unlike Post",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.id = id;

    const data = await postService.get(req.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Successfully Get Post",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const request = {
      page: req.query.page,
      limit: req.query.limit,
      caption: req.query.caption,
      tags: req.query.tags,
      search: req.query.search,
    };

    const data = await postService.getAll(req.userId, request);

    res.status(200).json({
      success: true,
      message: "Successfully Get Post",
      data: data.data,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.id = id;

    const request = {
      page: req.query.page,
      limit: req.query.limit,
      caption: req.query.caption,
      tags: req.query.tags,
      search: req.query.search,
    };

    req.body = { ...req.body, ...request };

    const data = await postService.getByUser(req.body);

    res.status(200).json({
      success: true,
      message: "Successfully Get Post",
      data: data.data,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const upload = async (req, res, next) => {
  try {
    const data = await postService.upload(req.userId, req.file);

    res.status(200).json({
      success: true,
      message: "Successfully Upload Image",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  update,
  deletePost,
  like,
  unlike,
  get,
  getAll,
  getByUser,
  upload,
};
