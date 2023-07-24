import { validation } from "../validation/validation.js";
import { prismaClient } from "../apps/db.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createPostValidation,
  getPostValidation,
  searchPostByUserValidation,
  searchPostValidation,
  updatePostValidation,
} from "../validation/post-validation.js";
import multer from "multer";

const create = async (user, request) => {
  const userReq = validation(createPostValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  return prismaClient.post.create({
    data: {
      image: userReq.image,
      caption: userReq.caption,
      tags: userReq.tags,
      likes: userReq.likes,
      user: {
        connect: {
          id: user,
        },
      },
    },
    select: {
      image: true,
      caption: true,
      tags: true,
      likes: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          username: true,
          email: true,
          photo: true,
        },
      },
    },
  });
};

const update = async (user, request) => {
  const userReq = validation(updatePostValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  const postExist = await prismaClient.post.findUnique({
    where: {
      id: userReq.id,
    },
    select: {
      userId: true,
    },
  });

  if (!postExist) {
    throw new ResponseError(400, "Post not found");
  }

  if (postExist.userId !== user) {
    throw new ResponseError(
      400,
      "You don't have permission to update this post"
    );
  }

  return prismaClient.post.update({
    where: {
      id: userReq.id,
    },
    data: {
      image: userReq.image,
      caption: userReq.caption,
      tags: userReq.tags,
      likes: userReq.likes,
    },
    select: {
      image: true,
      caption: true,
      tags: true,
      likes: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          username: true,
          email: true,
          photo: true,
        },
      },
    },
  });
};

const deletePost = async (user, request) => {
  const userReq = validation(getPostValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  const postExist = await prismaClient.post.findUnique({
    where: {
      id: userReq.id,
    },
    select: {
      userId: true,
    },
  });

  if (!postExist) {
    throw new ResponseError(404, "Post not found");
  }

  if (postExist.userId !== user) {
    throw new ResponseError(
      400,
      "You don't have permission to delete this post"
    );
  }

  return prismaClient.post.delete({
    where: {
      id: userReq.id,
    },
  });
};

const like = async (user, request) => {
  const userReq = validation(getPostValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  const postExist = await prismaClient.post.findUnique({
    where: {
      id: userReq.id,
    },
  });

  if (!postExist) {
    throw new ResponseError(404, "Post not found");
  }

  const userLiked = await prismaClient.userLiked.findUnique({
    where: {
      userId_postId: {
        userId: user,
        postId: userReq.id,
      },
    },
  });

  if (userLiked) {
    throw new ResponseError(400, "You already liked this post");
  } else {
    await prismaClient.post.update({
      where: {
        id: userReq.id,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    await prismaClient.userLiked.create({
      data: {
        user: {
          connect: {
            id: user,
          },
        },
        post: {
          connect: {
            id: userReq.id,
          },
        },
      },
    });
  }
};

const unlike = async (user, request) => {
  const userReq = validation(getPostValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  const postExist = await prismaClient.post.findUnique({
    where: {
      id: userReq.id,
    },
  });

  if (!postExist) {
    throw new ResponseError(404, "Post not found");
  }

  const checkUserLiked = await prismaClient.userLiked.findUnique({
    where: {
      userId_postId: {
        userId: user,
        postId: userReq.id,
      },
    },
  });

  if (!checkUserLiked) {
    throw new ResponseError(400, "You already unliked this post");
  } else {
    await prismaClient.post.update({
      where: {
        id: userReq.id,
      },
      data: {
        likes: {
          decrement: 1,
        },
      },
    });

    await prismaClient.userLiked.delete({
      where: {
        userId_postId: {
          userId: user,
          postId: userReq.id,
        },
      },
    });
  }
};

const get = async (user, request) => {
  const userReq = validation(getPostValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  const postExist = await prismaClient.post.findUnique({
    where: {
      id: userReq.id,
    },
    select: {
      id: true,
      image: true,
      caption: true,
      tags: true,
      likes: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          username: true,
          email: true,
          photo: true,
        },
      },
    },
  });

  if (!postExist) {
    throw new ResponseError(404, "Post not found");
  }

  return postExist;
};

const getAll = async (user, request) => {
  request = validation(searchPostValidation, request);

  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  const skip = (request.page - 1) * request.limit;

  const filter = [];

  if (request.caption) {
    filter.push({
      caption: {
        contains: request.caption,
        mode: "insensitive",
      },
    });
  }

  if (request.tags) {
    filter.push({
      tags: {
        contains: request.tags,
        mode: "insensitive",
      },
    });
  }

  if (request.search) {
    filter.push({
      OR: [
        {
          caption: {
            contains: request.search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            contains: request.search,
            mode: "insensitive",
          },
        },
        {
          likes: {
            equals: parseInt(request.search),
          },
        },
      ],
    });
  }

  const data = await prismaClient.post.findMany({
    where: {
      AND: filter,
    },
    select: {
      id: true,
      image: true,
      caption: true,
      tags: true,
      likes: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          username: true,
          email: true,
          photo: true,
        },
      },
    },
    take: request.limit,
    skip,
  });

  const totalPosts = await prismaClient.post.count({
    where: {
      AND: filter,
    },
  });

  if (request.page > Math.ceil(totalPosts / request.limit)) {
    throw new ResponseError(400, "Page not found");
  }

  return {
    data,
    pagination: {
      total: totalPosts,
      page: request.page,
      limit: request.limit,
    },
  };
};

const getByUser = async (request) => {
  request = validation(searchPostByUserValidation, request);

  const postExist = await prismaClient.post.count({
    where: {
      userId: request.id,
    },
  });

  if (postExist === 0) {
    throw new ResponseError(404, "Post not found");
  }

  const filters = [
    {
      userId: request.id,
    },
  ];

  if (request.caption) {
    filters.push({
      caption: {
        contains: request.caption,
        mode: "insensitive",
      },
    });
  }

  if (request.tags) {
    filters.push({
      tags: {
        contains: request.tags,
        mode: "insensitive",
      },
    });
  }

  if (request.search) {
    filters.push({
      OR: [
        {
          caption: {
            contains: request.search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            contains: request.search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const skip = (request.page - 1) * request.limit;

  const data = await prismaClient.post.findMany({
    where: {
      AND: filters,
    },
    select: {
      id: true,
      image: true,
      caption: true,
      tags: true,
      likes: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          username: true,
          email: true,
          photo: true,
        },
      },
    },
    take: request.limit,
    skip,
  });

  const totalPosts = await prismaClient.post.count({
    where: {
      AND: filters,
    },
  });

  if (request.page > Math.ceil(totalPosts / request.limit)) {
    throw new ResponseError(400, "Post not found");
  }

  return {
    data,
    pagination: {
      total: totalPosts,
      page: request.page,
      limit: request.limit,
    },
  };
};

// upload image
const uploadImg = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/file");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(
        new ResponseError(
          400,
          "File type not supported. Only support png, jpg, and jpeg"
        )
      );
    }
  },

  limits: {
    fileSize: 1024 * 1024,
  },
});

export const uploadImage = uploadImg.single("image");

const upload = async (user, request) => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });

  if (!userExist) {
    throw new ResponseError(404, "User not found");
  }

  if (!request) {
    throw new ResponseError(400, "Image not found");
  }

  const data = {};
  data.id = user;
  data.url = `http://localhost:3000/${request.path.replace("public/", "")}`;
  data.filename = request.filename;
  data.mimetype = request.mimetype;

  return data;
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
