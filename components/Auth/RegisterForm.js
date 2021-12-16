import styles from "../../styles/Form.module.css";
import btnStyles from "../../styles/Buttons.module.css";
import { Children, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/actions/authActions";
import { professions } from "../../data/professions";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
  CircularProgress,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ErrorsList from "../ErrorsList";

function RegisterForm({ toggleLogin }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
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
      <h6 className={styles.title}>Register</h6>

      <TextField
        label='Display Name'
        name='displayName'
        value={formData["displayName"] ?? ""}
        onChange={handleChange}
        required
        variant='outlined'
        className={styles.inp}
      />

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

      <FormControl required variant='outlined' className={styles.inp}>
        <InputLabel htmlFor='confirmPassword'>Confirm Password</InputLabel>
        <OutlinedInput
          id='confirmPassword'
          name='confirmPassword'
          type={showPassword ? "text " : "password"}
          value={formData["confirmPassword"] ?? ""}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={140}
        />
      </FormControl>

      <FormControl variant='outlined' className={styles.inp}>
        <InputLabel htmlFor='profession'>Profession</InputLabel>
        <Select
          id='profession'
          name='profession'
          value={formData["profession"] ?? ""}
          onChange={handleChange}
          labelWidth={80}>
          <MenuItem value='Anonymous'>
            <em>Anonymous</em>
          </MenuItem>
          {Children.toArray(professions.map((prof) => <MenuItem value={prof}>{prof}</MenuItem>))}
        </Select>
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
              Login
            </Button>
          </Fragment>
        )}
      </div>
    </form>
  );
}

export default RegisterForm;
