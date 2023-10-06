class CommentDto {
  constructor(comment) {
    this.content = comment.content;
    this.authorname = comment.author.username;
  }
}
export default CommentDto;
