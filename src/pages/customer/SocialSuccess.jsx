import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SocialSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-orange-500" />
        <p className="text-gray-500 dark:text-base-content/60 text-sm mt-4 font-semibold">
          Signing you in...
        </p>
      </div>
    </div>
  );
};

export default SocialSuccess;
