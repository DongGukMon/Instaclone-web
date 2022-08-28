import { isLoggedInVar, darkModeVar, logUserIn } from "../apollo";
import styled from "styled-components";
import { gql, useReactiveVar, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import { FatLink } from "../components/shared";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { useNavigate } from "react-router-dom";
import LoginMutation from "../mutations/LoginMutation";
import FormInputs from "../components/FormInputs";

//HeaderContatiner와 Subtitle은 다른 파일에서 재사용하지 않기 때문에 signUp 파일에 그대로 두는 것.
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

//createAccount api사용을 위한 선행작업
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

//반복적으로 쓰이는 문자열은 "result"의 오타 방지를 위해 상수화하여 사용
const RESULT = "result";

const SignUp = () => {
  //route를 위한 navigator 선언
  const navigate = useNavigate();

  //useForm!
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    getValues,
  } = useForm({
    mode: "onChange",
  });

  //로그인 api 결과값이 return되면 실행하는 함수
  const onLoginCompleted = ({ login: { ok, error, token } }) => {
    if (!ok) {
      console.log(error);
      setError(RESULT, { message: error });
      return;
    }
    if (token) {
      logUserIn(token);
    }
  };
  //login api 사용을 위한 준비. LoginMutation이라는 별도의 파일로 분리해놨기 때문에 LoginMutation만 import하면
  //이렇게 Sign up 처럼 다른 파일에서도 login api를 사용할 수 있도록 했음
  const { login } = LoginMutation(onLoginCompleted);

  //createAccount api 결과값이 리턴되면 사용할 수 있도록 했음
  const onCompleted = ({ createAccount: { ok, error } }) => {
    if (!ok) {
      //api 결과 error가 발생하면 "result"라는 이름의 error를 설정함.
      //error가 존재하는 한 useForm의 isValid는 false로 나타난다.
      //따라서 input 태그의 onFocus 혹은, onChange에서 clearError("result")를 해줘야 button이 활성화된다.
      setError(RESULT, { message: error });
      return;
    }
    const { username, password } = getValues();
    //회원가입 완료 후 자동로그인을 위해 login api 실행
    login({ variables: { username, password } });

    //message는 home에서 const location = useLocation()을 하면 location.state로 접근 가능
    navigate(routes.home, { message: "Account created!" });
  };

  //createAccount apit사용을 위해 useMutation 사용
  //login api는 재사용을 위해 이 부분을 다른 파일로 분리함
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  //form에서 submit했을 때 valiation을 통과했을 때 실행하는 함수
  const onSubmitValid = ({
    firstName,
    lastName,
    username,
    email,
    password,
  }) => {
    if (loading) {
      return;
    }
    //api를 실행하는 방법
    createAccount({
      variables: { firstName, lastName, username, email, password },
    });
  };

  const clearSignupError = () => {
    clearErrors(RESULT);
  };

  //signup에 input fields 각각의 정보(name, validation condition, placeholder)를 object형태로 담은 array
  const inputInfos = [
    {
      name: "firstName",
      condition: {
        required: "First name is required.",
      },
      placeholder: "First Name",
    },
    { name: "lastName", condition: {}, placeholder: "Last Name" },
    {
      name: "email",
      condition: {
        required: "Email is required.",
      },
      placeholder: "Email",
    },
    {
      name: "username",
      condition: {
        required: "Username is required.",
        minLength: {
          value: 5,
          message: "Username should be longer than 5 chars",
        },
      },
      placeholder: "Username",
    },
    {
      name: "password",
      condition: {
        required: "Password is required.",
      },
      placeholder: "Password",
    },
  ];

  return (
    <AuthLayout>
      <PageTitle title="Sign up | Instaclone" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <HeaderContainer>
          <Subtitle>
            Sign up to see photos and videos <br />
            from your friends
          </Subtitle>
        </HeaderContainer>

        <form onSubmit={handleSubmit(onSubmitValid)}>
          {/* input 필드가 5개나 되기 때문에 가독성과 코드 재사용을 위해 input 필드 정보를 담은 array(inputInfos)를 prop으로 주면 반복문을 통해 Input을 return해주는
          FormInputs component를 작성함. inputInfos외에도 register, clearSignupError, errors를 prop으로 받음 */}
          <FormInputs
            inputInfos={inputInfos}
            register={register}
            clearSignupError={clearSignupError}
            errors={errors}
          />
          <Button
            type="submit"
            value={loading ? "Loading" : "Sign up"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" link={routes.home} linkText="Log in" />
    </AuthLayout>
  );
};

export default SignUp;
