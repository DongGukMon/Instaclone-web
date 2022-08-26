import Input from "./auth/Input";
import FormError from "./auth/FormError";

export default function FormInputs({
  inputInfos,
  register,
  clearSignupError,
  errors,
}) {
  return inputInfos.map((inputInfo, index) => {
    const { name, condition, placeholder } = inputInfo;

    if (inputInfo.name) {
      return (
        <div style={{ width: "100%" }} key={index}>
          <Input
            {...register(name, condition)}
            type="text"
            placeholder={placeholder}
            hasError={Boolean(errors?.name?.message)}
            onFocus={clearSignupError}
            key={name}
          />
          <FormError key={index} message={errors[name]?.message} />
        </div>
      );
    } else {
      return;
    }
  });
}

//   <Input
//   {...register("firstName", {
//     required: "First name is required.",
//   })}
//   type="text"
//   placeholder="First Name"
//   hasError={Boolean(errors?.firstName?.message)}
//   onFocus={clearSignupError}
// />
// <FormError message={errors?.firstName?.message} />
// <Input
//   {...register("lastName")}
//   type="text"
//   placeholder="Last Name"
//   hasError={Boolean(errors?.lastNAme?.message)}
//   onFocus={clearSignupError}
// />
// <FormError message={errors?.lastName?.message} />
// <Input
//   {...register("email", {
//     required: "Email is required.",
//   })}
//   type="text"
//   placeholder="Email"
//   hasError={Boolean(errors?.email?.message)}
//   onFocus={clearSignupError}
// />
// <FormError message={errors?.email?.message} />
// <Input
//   {...register("username", {
//     required: "Username is required.",
//     minLength: {
//       value: 5,
//       message: "Username should be longer than 5 chars",
//     },
//   })}
//   type="text"
//   placeholder="Username"
//   hasError={Boolean(errors?.username?.message)}
//   onFocus={clearSignupError}
// />
// <FormError message={errors?.username?.message} />
// <Input
//   {...register("password", {
//     required: "Password is required.",
//   })}
//   type="password"
//   placeholder="Password"
//   hasError={Boolean(errors?.password?.message)}
//   onFocus={clearSignupError}
// />
// <FormError message={errors?.password?.message} />
