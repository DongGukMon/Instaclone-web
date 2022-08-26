import { logUserOut } from "../apollo";

function Home() {
  return (
    <div>
      <h1>Welcome!!!</h1>
      <h3
        onClick={() => {
          logUserOut();
        }}
      >
        Log out
      </h3>
    </div>
  );
}
export default Home;
