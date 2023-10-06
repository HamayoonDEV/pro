import Joi from "joi";
import fs from "fs";
import Blog from "../models/blog.js";
import { BACKEND_SERVER_PATH } from "../config/index.js";
import BlogDto from "../DTO/BlogDto.js";
import Comment from "../models/comment.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
  //create blog
  async createBlog(req, res, next) {
    const createBlogSchema = Joi.object({
      content: Joi.string().required(),
      title: Joi.string().required(),
      photopath: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, author } = req.body;
    //read photo in the buffer
    const buffer = Buffer.from(
      photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    //allocat random name to the photo
    const imagePath = `${Date.now()}-${author}.png`;
    //save locally
    fs.writeFileSync(`storage/${imagePath}`, buffer);
    //save to the database
    let blog;
    try {
      const newBlog = new Blog({
        content,
        title,
        photopath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        author,
      });
      blog = await newBlog.save();
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(201).json(blog);
  },
  //get all blog
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({}).populate("author");
      const blogArr = [];
      for (let i = 0; i < blogs.length; i++) {
        const blog = new BlogDto(blogs[i]);
        blogArr.push(blog);
      }
      return res.status(200).json({ blogs: blogArr });
    } catch (error) {
      return next(error);
    }
  },
  //get blog by Id
  async getBlogById(req, res, next) {
    const getBlogByIdSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = getBlogByIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let blog;
    try {
      blog = await Blog.findOne({ _id: id }).populate("author");
      if (!blog) {
        const error = {
          status: 404,
          message: "Blog not found!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    const blogDto = new BlogDto(blog);
    //sending response
    res.status(200).json({ blog: blogDto });
  },
  //update blog method
  async updateBlog(req, res, next) {
    const updateBlogSchema = Joi.object({
      content: Joi.string(),
      title: Joi.string(),
      photopath: Joi.string(),
      author: Joi.string().regex(mongoIdPattern).required(),
      blogId: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = updateBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { content, title, photopath, blogId, author } = req.body;
    try {
      const blog = await Blog.findOne({ _id: blogId });
      if (photopath) {
        let previous = blog.photopath;
        previous = previous.split("/").at(-1);
        fs.unlinkSync(`storage/${previous}`);
        //read photo in the buffer
        const buffer = Buffer.from(
          photopath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );
        //allocat random name to the photo
        const imagePath = `${Date.now()}-${author}.png`;
        //save locally
        fs.writeFileSync(`storage/${imagePath}`, buffer);
        //update to database
        try {
          await Blog.updateOne({
            content,
            title,
            photopath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
            author,
          });
        } catch (error) {
          return next(error);
        }
      } else {
        await Blog.updateOne({
          content,
          title,
          author,
        });
      }
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "BLog has been updated!" });
  },
  //delete method
  async delete(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });
    const { error } = deleteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      await Blog.deleteOne({ _id: id });
      await Comment.deleteMany({});
    } catch (error) {
      return next(error);
    }
    //sending response
    res.status(200).json({ message: "blog has been delete!" });
  },
};

export default blogController;
