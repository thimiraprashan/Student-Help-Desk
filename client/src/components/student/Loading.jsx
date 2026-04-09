import { useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { backendUrl, getToken } = useContext(AppContext);

  useEffect(() => {
    const verifyStripePayment = async () => {
      if (sessionId) {
        try {
          const token = await getToken();
          await axios.post(`${backendUrl}/api/user/verify-purchase`, { sessionId }, { headers: { Authorization: `Bearer ${token}` }});
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (path) {
      if (sessionId) {
          verifyStripePayment();
      }

      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, sessionId ? 2000 : 5000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [path, sessionId, navigate, backendUrl, getToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
