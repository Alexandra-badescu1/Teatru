import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { useAppContext } from "../context/Context";

interface User {
  username: string;
  password: string;
}


interface LoginResponse {
  token: string;
  role: string;
  username:string;
}

const LogIn = () => {
  const [user, setUser] = useState<User>({ username: "", password: "" });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post<LoginResponse>(
        "/user/login",
        user
      );

      await login(user.username, user.password);
      navigate("/profile");
    } catch (error: any) {
      setError("Login failed. Check your credentials.");
      console.error("Login failed", error.response?.data || error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="text-center">Log In</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label"><h6>Username</h6></label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label"><h6>Password</h6></label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
