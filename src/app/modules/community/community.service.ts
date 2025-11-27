import { IComment, IGroup, IPost } from './community.interface';
import { GroupModel, PostModel, CommentModel } from './community.model';
import { Types } from 'mongoose';

// @Group Service Methods
//createGroup by the user
const createGroup = async (
  groupData: { name: string; image?: string },
  createdBy: Types.ObjectId
) => {
  const newGroup = new GroupModel({
    ...groupData,
    createdBy,
  });
  return await newGroup.save();
};

// @Group Service Methods
//get the group from database...
const getGroups = async () => {
  const groups = await GroupModel.find().populate('createdBy', 'name');
  return groups;
};

// @Post Service Methods
// @create post by user
const createPost = async (
  postData: { group: Types.ObjectId; description: string; image?: string[] },
  userId: Types.ObjectId
) => {
  const newPost = new PostModel({
    ...postData,
    user: userId,
  });
  return await newPost.save();
};

// @Post Service Methods
// @get the post by id.
const getPostsByGroup = async (groupId: Types.ObjectId) => {
  return await PostModel.find({ group: groupId })
    .populate('user', 'name image')
    .populate('group', 'name image')
    .sort({ createdAt: -1 });
};

// @Comment Service Methods
// @Create Comment in specific
// create top-level comment
const createComment = async (
  commentData: { text: string; image?: string[] },
  groupId: Types.ObjectId,
  postId: Types.ObjectId,
  userId: Types.ObjectId | string
) => {
  const newComment = new CommentModel({
    ...commentData,
    group: groupId,
    post: postId,
    user: new Types.ObjectId(userId),
  });

  return await newComment.save();
};

// @add reply to a comment
const addReply = async (
  commentId: string,
  userId: string,
  replyData: { text: string; image?: string[] }
) => {
  const { text, image } = replyData;
  const replyUserId = new Types.ObjectId(userId);
  await CommentModel.updateOne(
    { _id: commentId },
    {
      $push: {
        replies: {
          user: replyUserId,
          text: text.trim(),
          image,
          createdAt: new Date(),
        },
      },
    }
  );
  const updatedComment = await CommentModel.findById(commentId)
    .populate('user', 'name email')
    .populate('replies.user', 'name email');

  if (!updatedComment) {
    throw new Error('Comment not found');
  }
  return updatedComment;
};

// @Comment Service Methods
// @get Comment in specific
// get comments for a post
const getCommentsByPost = async (postId: Types.ObjectId) => {
  const comments = await CommentModel.find({ post: postId })
    .populate('user', 'name email')
    .populate('replies.user', 'name email')
    .exec();

  return comments;
};

/**
 * Edit a top-level comment
 *
 */
const editComment = async (
  commentId: string,
  userId: string,
  data: { text: string; image: string[] }
) => {
  const updatedComment = await CommentModel.findOneAndUpdate(
    { _id: commentId, user: new Types.ObjectId(userId) },
    { $set: data },
    { new: true }
  )
    .populate('user', 'name email')
    .populate('replies.user', 'name email');

  if (!updatedComment) throw new Error('Comment not found or not authorized');
  return updatedComment;
};

/**
 * Delete a top-level comment
 */
const deleteComment = async (commentId: string, userId: string) => {
  const deletedComment = await CommentModel.findOneAndDelete({
    _id: commentId,
    user: new Types.ObjectId(userId),
  });

  if (!deletedComment) throw new Error('Comment not found or not authorized');
  return deletedComment;
};
/**
 * Edit a reply inside a comment
 */
export const editReply = async (
  commentId: string,
  replyId: string,
  userId: string,
  data: { text?: string; image?: string[] }
) => {
  const comment = await CommentModel.findById({
    _id: commentId,
    user: new Types.ObjectId(userId),
  });
  if (!comment) throw new Error('Comment not found');

  const reply = comment.replies.find(r => r._id.toString() === replyId);
  if (!reply) throw new Error('Reply not found');
  if (data.text) reply.text = data.text;
  if (data.image) reply.image = data.image;

  await comment.save();

  return await CommentModel.findById(commentId)
    .populate('user', 'name email')
    .populate('replies.user', 'name email');
};

/**
 * Delete a reply inside a comment
 */
const deleteReply = async (
  commentId: string,
  replyId: string,
  userId: string
) => {
  const updatedComment = await CommentModel.findOneAndUpdate(
    { _id: commentId },
    {
      $pull: {
        replies: { _id: replyId, user: new Types.ObjectId(userId) },
      },
    },
    { new: true }
  )
    .populate('user', 'name email')
    .populate('replies.user', 'name email');

  if (!updatedComment) throw new Error('Reply not found or not authorized');

  return updatedComment;
};

export const CommunityService = {
  createGroup,
  getGroups,
  createPost,
  getPostsByGroup,
  createComment,
  addReply,
  getCommentsByPost,
  editComment,
  deleteComment,
  editReply,
  deleteReply,
};
