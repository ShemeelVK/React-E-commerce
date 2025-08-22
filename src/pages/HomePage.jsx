import { useNavigate } from "react-router-dom";
function HomePage(){
    const navigate=useNavigate();
    function handleLogout(){
        localStorage.removeItem("user")
        navigate("./Login")
    }

    return(
        <>
        <h2>This is Homepage</h2>
        <button onClick={handleLogout}>Logout</button>
        </>
    );
}
export default HomePage