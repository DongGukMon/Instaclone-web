import { useQuery, gql } from "@apollo/client";
import { logUserOut } from "../apollo";
import PageTitle from "../components/PageTitle";

import Photo from "../../src/components/feed/Photo";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      user {
        id
        username
        avatar
      }
      file
      caption
      likes
      commentNumber
      comments {
        id
        payload
        user {
          username
          avatar
        }
        isMine
        createdAt
      }
      createdAt
      isMine
      isLiked
    }
  }
`;

function Home() {
  const { data } = useQuery(FEED_QUERY);
  console.log("Home render");

  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed?.map((photo) => {
        return <Photo key={photo.id} {...photo} />;
      })}
    </div>
  );
}
export default Home;
