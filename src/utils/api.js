import axios from "axios"
import toast from "react-hot-toast";

    const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true,
    headers: {
        "Content-type": "application/json",
    },
    });

//adding interceptors
//this is used to automatically get the token from the local storage to and attach it to every api request
api.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem("token");
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/login")) {
      return Promise.reject(error);
    }

    // FIX 2: PREVENT INFINITE LOOPS (Keep this from before)
    if (originalRequest.url.includes("/Auth/Refresh-Token")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 403 error (Blocked user)
    if (
      error.response?.status === 403 &&
      error.response?.data?.message ===
        "Your account has been suspended. Please contact support."
    ) {
      // Prevent duplicate toasts if multiple APIs fail at once
      toast.dismiss();

      toast.error("You have been blocked by the Admin. Logging out...", {
        id: "blocked-toast",
        duration: 3000,
      });

      // Clear all auth data
      localStorage.clear();

      // Redirect after a short delay so user sees the message
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

      return Promise.reject(error);
    }

    // Normal 401 (Session Expired) Handling
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/Auth/Refresh-Token");
        const {token} = response.data;

        localStorage.setItem("token", token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {

        if (
          refreshError.response?.status === 401 ||
          refreshError.response?.status === 403
        ) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api