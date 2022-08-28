import { darkModeVar, logUserIn } from "../apollo";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookSquare,
} from "@fortawesome/free-brands-svg-icons";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Separator from "../components/auth/Separator";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import LoginMutation from "../mutations/LoginMutation";
import { useLocation } from "react-router-dom";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Login = () => {
  // 아래와같이 useLocation을 사용하면 navigator를 통해 전달한 state에 접근할 수 있다.
  // const location = useLocation()
  // console.log(location.state)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    // 아래와 같이 defaultValues를 사용하면 input의 value 초기값을 설정할 수 있다. location.state를 쓰면 다른 페이지에서 전달받은 변수를 넣을 수 있다.
    // defaultValues:{
    //   username:location?.state?.username || "",
    //   password:location?.state?.password || ""
    // }
  });

  const onCompleted = ({ login: { ok, error, token } }) => {
    if (!ok) {
      console.log(error);
      setError("result", { message: error });
      return;
    }
    if (token) {
      logUserIn(token);
    }
  };

  const { login, loading } = LoginMutation(onCompleted);

  const onSubmitValid = ({ username, password }) => {
    if (loading) {
      return;
    }

    login({ variables: { username, password } });
  };

  const clearLoginError = () => {
    clearErrors("result");
  };

  return (
    <AuthLayout>
      <PageTitle title="Log in | Instaclone" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>

        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "Username is required.",
              minLength: {
                value: 5,
                message: "Username should be longer than 5 chars",
              },
            })}
            type="text"
            placeholder="Username"
            hasError={Boolean(errors?.username?.message)}
            onFocus={clearLoginError}
          />
          <FormError message={errors?.username?.message} />
          <Input
            {...register("password", {
              required: "Password is required.",
            })}
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
            onFocus={clearLoginError}
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading" : "Log in"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
        <Separator>Or</Separator>
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        link={routes.signUp}
        linkText="Sign up"
      />
    </AuthLayout>
  );
};

export default Login;
