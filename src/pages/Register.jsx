import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Login from "./Login";

function Register(){
    const [email,setEmail]=useState("")
    const [password,setpassword]=useState("")
    const navigate=useNavigate();

    const handleregister=async (e)=>{
        e.preventDefault();

        try{
           const res = await axios.get(`http://localhost:3000/users?email=${email}`);
           if (res.data.length>0){
             alert("User already exists")
             navigate("/Login")
           }

           else {
            await axios.post("http://localhost:3000/users",{
                email,
                password
            });
            alert("Registration Successfull !!")
            navigate("./Login")
           }
       }  

       catch(err){
        console.log("Error",err);
       }
    }

    return (
      <>
        <div>
          <h2>Registration</h2>
          <div>
            <form onSubmit={handleregister}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
              <br />

              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </>
    );
}
export default Register