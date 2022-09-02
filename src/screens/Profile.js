import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { PHOTO_FRAGMENT } from "../fragments";

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

function Profile() {
  const { username } = useParams();
  const { data } = useQuery(SEE_PROFILE_QUERY, {
    variables: { username, page: 1 },
  });
  console.log(data);
  return <div>{username}</div>;
}

export default Profile;
