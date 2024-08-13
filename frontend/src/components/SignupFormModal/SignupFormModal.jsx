import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signup-modal-container">
      <div className="signup-modal-content">
        <h1 className="signup-modal-title">Sign Up</h1>
        {errors.server && <p className="signup-error">{errors.server}</p>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-label">
            First Name
            <input
              className="signup-input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.first_name && <p className="signup-error">{errors.first_name}</p>}
          <label className="signup-label">
            Last Name
            <input
              className="signup-input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.last_name && <p className="signup-error">{errors.last_name}</p>}
          <label className="signup-label">
            Email
            <input
              className="signup-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="signup-error">{errors.email}</p>}
          <label className="signup-label">
            Username
            <input
              className="signup-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p className="signup-error">{errors.username}</p>}
          <label className="signup-label">
            Password
            <input
              className="signup-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="signup-error">{errors.password}</p>}
          <label className="signup-label">
            Confirm Password
            <input
              className="signup-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && <p className="signup-error">{errors.confirmPassword}</p>}
          <button className="signup-button" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
