import { gql, useMutation } from "@apollo/client";
const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

export default function LoginMutation(onCompleted) {
  const [login, { loading }] = useMutation(LOGIN_MUTATION, { onCompleted });
  return { login, loading };
}
