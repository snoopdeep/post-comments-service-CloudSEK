import React from 'react';
import CommentItem from './CommentItem';

function CommentList({ comments, postId }) {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          postId={postId}
          level={0}
        />
      ))}
    </div>
  );
}

export default CommentList;
