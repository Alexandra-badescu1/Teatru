import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { useAppContext } from "../context/Context";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const SignUp = () => {
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    const { firstName, lastName, email, password } = user;

    const userPayload = {
      username: `${firstName} ${lastName}`,
      email,
      password,
    };

    formData.append("product", JSON.stringify(userPayload));
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      await api.post("/user/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      login(userPayload.email, "User"); // adaugă automat userul în context
      navigate("/profile");
    } catch (error: any) {
      console.error("Error signing up:", error.response?.data || error.message);
      alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="text-center">Sign Up</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label"><h6>First Name</h6></label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>Last Name</h6></label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label"><h6>Email</h6></label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
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
          <div className="col-md-6">
            <label className="form-label"><h6>Confirm Password</h6></label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label"><h6>Profile Picture</h6></label>
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              name="imageFile"
              required
            />
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
