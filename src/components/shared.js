import styled from "styled-components";

export const BaseBox = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
`;

export const FatLink = styled.span`
  font-weight: 600;
  color: rgb(142, 142, 142);
`;

export const FatText = styled.span`
  font-weight: 600;
`;
