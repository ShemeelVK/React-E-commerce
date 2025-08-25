import { Link } from "react-router-dom";
function Navbar(){
    return (
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-4/5 z-50 bg-gray-50 rounded-2xl shadow-lg border border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <div className="text-2xl font-extrabold tracking-wide text-indigo-700">
            Elevé
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8">
            {["Home", "Shop", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item}`}
                className="relative text-gray-800 font-medium hover:text-indigo-700 transition-colors duration-300 group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-700 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Login / Profile */}
          <div>
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 transition">
              Profile
            </button>
          </div>
        </div>
      </nav>
    );
}
export default Navbar