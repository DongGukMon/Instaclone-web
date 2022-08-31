import styled from "styled-components";
import Comment from "./Comment";
import PropTypes from "prop-types";

const SComments = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  display: block;
  opacity: 0.7;
  margin: 10px 0px;
  font-weight: 600;
  font-size: 12px;
`;

export default function Comments({ author, comments, caption, commentNumber }) {
  return (
    <SComments>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          author={comment.user.username}
          payload={comment.payload}
        />
      ))}
    </SComments>
  );
}

Comments.propTypes = {
  author: PropTypes.string.isRequired,
  cation: PropTypes.string,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      payload: PropTypes.string.isRequired,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
      isMine: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
  commentNumber: PropTypes.number.isRequired,
};
