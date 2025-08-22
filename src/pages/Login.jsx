import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import HomePage from "./HomePage";

function Login() {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate();
    
    const handlelogin=async (e)=>{
        e.preventDefault();

        try{
            const res=await axios.get(`http://localhost:3000/users?email=${email}`);
            if(res.data.length>0){
                const user=res.data[0];
            
            if(user.email===email && user.password===password){
                alert("Login Successfull")
                
                localStorage.setItem("user",JSON.stringify({"email":email}));
                navigate("/HomePage")
            }
            else{
                alert("Invalid Credentials")
            }
        }
        }
        catch(err){
            console.log("Error",err);
        }

    }

  return (
    <>
      <h2>This is login PAGE</h2>
      <div>
        <form onSubmit={handlelogin}>
            <label>Email</label>
            <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="username" required/><br/><br/>
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" required/>
            <button type="submit">Login</button>
        </form>
      </div>
    </>
  ); 
}
export default Login;
