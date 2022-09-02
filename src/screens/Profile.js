import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { PHOTO_FRAGMENT } from "../fragments";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { FatText } from "../components/shared";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import useUser from "../hooks/useUser";

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!, $page: Int!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      bio
      avatar
      totalFollowing
      totalFollowers
      isMe
      isFollowing
      photos(page: $page) {
        ...PhotoFragment
      }
    }
  }
  ${PHOTO_FRAGMENT}
`;

const UNFOLLOW_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
    }
  }
`;
const FOLLOW_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
    }
  }
`;

const Header = styled.div`
  display: flex;
`;
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;
const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  margin-left: 10px;
  margin-top: 0px;
  &:hover {
    cursor: pointer;
  }
`;

function Profile() {
  const { username } = useParams();
  const userData = useUser();
  const { data } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username,
      page: 1,
    },
  });

  const followToggleUpdate = (cache, followData) => {
    const userId = `User:${data.seeProfile.id}`;
    const loggedInUserId = `User:${userData.data?.me.id}`;
    if (followData?.data?.unfollowUser) {
      const {
        data: {
          unfollowUser: { ok },
        },
      } = followData;
      if (ok && loggedInUserId && userId) {
        cache.modify({
          id: userId,
          fields: {
            isFollowing: () => false,
            totalFollowers: (prev) => prev - 1,
          },
        });
        cache.modify({
          id: loggedInUserId,
          fields: {
            totalFollowing: (prev) => prev - 1,
          },
        });
      }
    } else if (followData?.data?.followUser) {
      const {
        data: {
          followUser: { ok },
        },
      } = followData;
      if (ok && loggedInUserId && userId) {
        cache.modify({
          id: userId,
          fields: {
            isFollowing: () => true,
            totalFollowers: (prev) => prev + 1,
          },
        });
        cache.modify({
          id: loggedInUserId,
          fields: {
            totalFollowing: (prev) => prev + 1,
          },
        });
      }
    }
  };

  const [followMutation] = useMutation(FOLLOW_MUTATION, {
    update: followToggleUpdate,
  });

  const [unfollowMutation] = useMutation(UNFOLLOW_MUTATION, {
    update: followToggleUpdate,
  });

  const getButton = (seeProfile) => {
    const { isMe, isFollowing, username } = seeProfile;
    if (isMe) {
      return <ProfileBtn>Edit profile</ProfileBtn>;
    }
    if (isFollowing) {
      return (
        <ProfileBtn
          onClick={() => {
            unfollowMutation({ variables: { username } });
          }}
        >
          Unfollow
        </ProfileBtn>
      );
    } else {
      return (
        <ProfileBtn
          onClick={() => {
            followMutation({ variables: { username } });
          }}
        >
          Follow
        </ProfileBtn>
      );
    }
  };

  return (
    <div>
      <PageTitle title={`${data?.seeProfile?.username}'s Profile`} />
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.username}</Username>
            {data?.seeProfile && getButton(data.seeProfile)}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo bg={photo.file} key={photo.id}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}

export default Profile;
