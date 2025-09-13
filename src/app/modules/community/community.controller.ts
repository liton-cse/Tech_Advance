import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CommunityService } from './community.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import {
  getMultipleFilesPath,
  getSingleFilePath,
} from '../../../shared/getFilePath';

// @Group Controller
// @apiend point: api/v1/groups
// @method:post
const createGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let image = getSingleFilePath(req.files, 'image');
    const group = await CommunityService.createGroup(
      { ...req.body, image },
      req.user.id
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Group created successfully',
      data: group,
    });
  }
);
// @apiend point:api/v1/groups
// @method:get
const getGroups = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const groups = await CommunityService.getGroups();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Group data fetch successfully',
      data: groups,
    });
  }
);

// @Post Controller
// @Apiend Point: api/v1/groups/:groupId/posts
// @method:post
const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = new Types.ObjectId(req.params.groupId);
    let image = getMultipleFilesPath(req.files, 'image');

    const post = await CommunityService.createPost(
      { ...req.body, image, group: groupId },
      req.user.id
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Post created successfully',
      data: post,
    });
  }
);

// @Post Controller
// @Apiend Point: api/v1/groups/:groupId/posts
// @method:get
const getPostsByGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = new Types.ObjectId(req.params.groupId);
    const posts = await CommunityService.getPostsByGroup(groupId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Post get from Group successfully',
      data: posts,
    });
  }
);

// @Comment Controller
// @apiend point: api/v1/comment
// @method:post
const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = new Types.ObjectId(req.params.groupId);
    const postId = new Types.ObjectId(req.params.postId);
    let image = getMultipleFilesPath(req.files, 'image');
    console.log(req.body);
    const comment = await CommunityService.createComment(
      { ...req.body, image },
      groupId,
      postId,
      req.user.id
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Comment created successfully',
      data: comment,
    });
  }
);

// @reply to a comment
// @apiend point:api/v1/groups/comments/:commentId/replies
// @method:post
const replyToComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    let image = getMultipleFilesPath(req.files, 'image');
    const updatedComment = await CommunityService.addReply(
      commentId,
      req.user.id,
      { ...req.body, image }
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Reply added successfully',
      data: updatedComment,
    });
  }
);

// @Comment Controller
// @apiend point: api/v1/comment
// @method:get
// get comments for a post
const getCommentsByPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = new Types.ObjectId(req.params.postId);
    const comments = await CommunityService.getCommentsByPost(postId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Comments fetched successfully',
      data: comments,
    });
  }
);

// @Edit top-level comment
// @apiend point:api/v1/groups/comments/:commentId
// @method:put
const updateComment = catchAsync(async (req: Request, res: Response) => {
  let image = getMultipleFilesPath(req.files, 'image');
  const updatedComment = await CommunityService.editComment(
    req.params.commentId,
    req.user.id,
    { ...req.body, image }
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Comment updated successfully',
    data: updatedComment,
  });
});

// @Delete top-level comment
// @apiend point:api/v1/groups/comments/:commentId
// @method:delete
const removeComment = catchAsync(async (req: Request, res: Response) => {
  await CommunityService.deleteComment(req.params.commentId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Comment deleted successfully',
    data: null,
  });
});

// @Edit reply
// @apiend point:api/v1/groups/comments/:commentId/replies/:replyId
// @method:put
export const updateReply = catchAsync(async (req: Request, res: Response) => {
  let image = getMultipleFilesPath(req.files, 'image');
  const updatedComment = await CommunityService.editReply(
    req.params.commentId,
    req.params.replyId,
    req.user.id,
    { ...req.body, image }
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reply updated successfully',
    data: updatedComment,
  });
});

// @Delete reply
// @apiend point:api/v1/groups/comments/:commentId/replies/:replyId
// @method:delete
export const removeReply = catchAsync(async (req: Request, res: Response) => {
  const deletedComment = await CommunityService.deleteReply(
    req.params.commentId,
    req.params.replyId,
    req.user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reply deleted successfully',
    data: deletedComment,
  });
});

export const CommunityController = {
  createComment,
  createGroup,
  createPost,
  getCommentsByPost,
  getPostsByGroup,
  getGroups,
  replyToComment,
  updateComment,
  removeComment,
  updateReply,
  removeReply,
};
