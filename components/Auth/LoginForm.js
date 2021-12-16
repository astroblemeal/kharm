import styles from "../../styles/Form.module.css";
import btnStyles from "../../styles/Buttons.module.css";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/authActions";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ErrorsList from "../ErrorsList";

function LoginForm({ toggleLogin }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  // change input data
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // hide or show password
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // clear any errors from redux on-unmount
  useEffect(() => {
    return () => {
      dispatch({ type: "AUTH_ERROR", error: false });
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className={`${styles.form}`}>
      <h6 className={styles.title}>Login</h6>

      <TextField
        label='Username'
        name='username'
        value={formData["username"] ?? ""}
        onChange={handleChange}
        required
        variant='outlined'
        className={styles.inp}
      />

      <FormControl required variant='outlined' className={styles.inp}>
        <InputLabel htmlFor='password'>Password</InputLabel>
        <OutlinedInput
          id='password'
          name='password'
          type={showPassword ? "text " : "password"}
          value={formData["password"] ?? ""}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={80}
        />
      </FormControl>

      {auth.error && <ErrorsList errors={[auth.error]} />}

      <div className={`${styles.btnWrap}`}>
        {auth.loading ? (
          <CircularProgress />
        ) : (
          <Fragment>
            <Button
              variant='contained'
              className={`${styles.btn} ${btnStyles.blueRadient}`}
              type='submit'>
              Submit
            </Button>
            <Button
              variant='outlined'
              className={`${styles.btn} ${btnStyles.white}`}
              onClick={toggleLogin}>
              Register
            </Button>
          </Fragment>
        )}
      </div>
    </form>
  );
}

export default LoginForm;
