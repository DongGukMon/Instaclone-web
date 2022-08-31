import styled from "styled-components";
import { FatText } from "../shared";

const SComment = styled.div`
  margin-top: 10px;
`;
const CommentCaption = styled.span`
  margin-left: 5px;
`;

export default function Comment({ author, payload }) {
  return (
    <SComment>
      <FatText>{author}</FatText>
      <CommentCaption>
        {payload.replace(/#[\w]+/g, "<mark>$&</mark>")}
      </CommentCaption>
    </SComment>
  );
}
