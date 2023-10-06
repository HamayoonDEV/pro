class BlogDto {
  constructor(blog) {
    this._id = blog._id;
    this.content = blog.content;
    this.title = blog.title;
    this.photopath = blog.photopath;
    this.createAt = blog.createAt;
    this.authorId = blog.author._id;
    this.AutherUsername = blog.author.username;
    this.Authorname = blog.author.name;
  }
}
export default BlogDto;
