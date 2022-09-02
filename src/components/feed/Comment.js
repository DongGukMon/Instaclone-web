import React from "react";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const SComment = styled.div`
  margin-top: 10px;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: white;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DeleteButton = styled.button`
  margin-right: 3px;
  border: none;
  background-color: white;
  &:hover {
    cursor: pointer;
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

function Comment({ author, payload, id, isMine, photoId }) {
  console.log("comment render");
  const deleteCommentUpdate = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber: (prev) => prev - 1,
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    update: deleteCommentUpdate,
  });

  return (
    <SComment>
      <div>
        <Link to={`/users/${author}`}>
          <FatText>{author}</FatText>
        </Link>
        <CommentCaption>
          {payload.split(" ").map((word, index) =>
            /#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/.test(word) ? (
              <React.Fragment key={index}>
                <Link to={`/hashtags/${word}`}>{word} </Link>
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>{word} </React.Fragment>
            )
          )}
        </CommentCaption>
      </div>
      {!isMine ? null : (
        <DeleteButton
          onClick={() => deleteCommentMutation({ variables: { id } })}
        >
          ❌
        </DeleteButton>
      )}
    </SComment>
  );
}

export default React.memo(Comment);
