import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
function Home(){
    const navigate=useNavigate();
    function handleLogout(){
        localStorage.removeItem("user")
        navigate("./Login")
    }

    return (
      <>
        <div
          className="min-h-screen bg-cover  bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1330&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          {/* Transparent Navbar */}
          <Navbar />

          {/* Hero Section */}
          <div className="pt-60 text-center text-white drop-shadow-lg px-6">
            <h1 className="text-[4rem] md:text-6xl font-extrabold mb-6">
              Elevé: Luxe in Every Step
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Discover limited-edition sneakers crafted for the elite.
            </p>
            <button className="mt-10 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-semibold shadow-lg transition duration-300">
              Shop Now
            </button>
          </div>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </>
    );
}
export default Home