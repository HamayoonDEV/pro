import * as yup from "yup";
const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const LoginSchema = yup.object().shape({
  username: yup.string().min(5).max(30).required("username is required!"),
  password: yup
    .string()
    .matches(passwordPattren, {
      message: "atleast 1 uppercase ,lowercase and digit is required!",
    })
    .required("password is required!"),
});
export default LoginSchema;
