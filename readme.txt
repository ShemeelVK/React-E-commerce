import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 1. Check if user already exists in db.json
      const res = await axios.get("http://localhost:3000/users?email=" + email);

      if (res.data.length > 0) {
        alert("User already registered. Please login.");
        navigate("/login");
        return;
      }

      // 2. If not exists → save new user (with email + password)
      await axios.post("http://localhost:3000/users", {
        email,
        password,  // password stored in DB now
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
