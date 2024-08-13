import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = async () => {
    const demoCredentials = {
      email: "demo@aa.io",
      password: "password"
    };

    const serverResponse = await dispatch(thunkLogin(demoCredentials));

    if (!serverResponse) {
      closeModal();
    }
  };

  return (
    <div className="login-modal-container">
      <div className="login-modal-content">
        <h1 className="login-modal-title">Log In</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Email
            <input
              className="login-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="login-error">{errors.email}</p>}
          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="login-error">{errors.password}</p>}
          <button className="login-button" type="submit">Log In</button>
        </form>

        <button onClick={handleDemoLogin} className="demo-user-button">
          Demo User
        </button>
      </div>
    </div>
  );
}

export default LoginFormModal;
