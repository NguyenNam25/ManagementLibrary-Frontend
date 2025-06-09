import { Navigate, Outlet, useNavigate } from "react-router-dom";
import userApi from "../../api/user";
import { useEffect, useState } from "react";
import roleApi from "../../api/role";

const ProtectedUser = () => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        const roleResponse = await roleApi.getRoleById(response.data.role);
        
        setUser(response.data);
        setCurrentRole(roleResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && !error && user) {
      if (!(currentRole.name === "admin" || currentRole.name === "manager")) {
        // Gọi API logout để xóa cookie
        userApi.logout().then(() => {
          navigate('/');
        });
      }
    }
  }, [loading, error, user, navigate]);

  if (loading) return <div>Loading...</div>;

  if (error || !user) {
    return <Navigate to="/" />;
  }

  if (currentRole.name === "admin" || currentRole.name === "manager") {
    return <Outlet />;
  }

  return null; // chờ logout gọi API xong rồi redirect
};

export default ProtectedUser;
