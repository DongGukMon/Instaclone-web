import styled from "styled-components";

const SAvatar = styled.div`
  width: ${(props) => (props.isLarge ? "30px" : "25px")};
  height: ${(props) => (props.isLarge ? "30px" : "25px")};
  border-radius: 50%;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const Image = styled.img`
  max-width: 100%;
`;

const Avatar = ({ url = "", lg = false }) => {
  return (
    <SAvatar isLarge={lg}>{url !== "" ? <Image src={url} /> : null}</SAvatar>
  );
};

export default Avatar;
