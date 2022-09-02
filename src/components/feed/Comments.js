import styled from "styled-components";
import Comment from "./Comment";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import Input from "../auth/Input";
import { gql, useMutation } from "@apollo/client";
import useUser from "../../hooks/useUser";
import { useHref } from "react-router-dom";

const SComments = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  display: block;
  opacity: 0.7;
  margin: 10px 0px 15px 0px;
  font-weight: 600;
  font-size: 12px;
`;

const InputContainer = styled.div`
  margin-top: 10px;
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($payload: String!, $photoId: Int!) {
    createComment(payload: $payload, photoId: $photoId) {
      ok
      error
      id
    }
  }
`;

export default function Comments({
  author,
  comments,
  caption,
  commentNumber,
  photoId,
}) {
  console.log("comments render");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const {
    data: { me: user },
  } = useUser();

  const createCommentUpdate = (cache, result) => {
    const { payload } = getValues();
    setValue("payload", "");
    const id = `Photo:${photoId}`;

    const {
      data: {
        createComment: { ok, id: commentId },
      },
    } = result;
    if (ok && useHref) {
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now().toString(),
        id: commentId,
        isMine: true,
        payload,
        user,
      };

      const newCacheComment = cache.writeFragment({
        fragment: gql`
          fragment BSName on Comment {
            createdAt
            id
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
        data: newComment,
      });

      cache.modify({
        id,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [createCommentMutation, { loading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      update: createCommentUpdate,
    }
  );

  const onValid = ({ payload }) => {
    if (loading) {
      return;
    }
    // const newPayload = payload;
    createCommentMutation({ variables: { payload, photoId } });
  };

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
          id={comment.id}
          isMine={comment.isMine}
          photoId={photoId}
        />
      ))}
      <InputContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("payload", { required: true })}
            type="text"
            placeholder="Input messages"
          />
        </form>
      </InputContainer>
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
