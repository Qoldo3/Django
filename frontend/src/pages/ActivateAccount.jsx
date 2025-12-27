import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ActivateAccount() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activate = async () => {
      try {
        await api.get(`/accounts/api/v1/activate/${token}/`);
        navigate('/activation-success');
      } catch (err) {
        navigate('/activation-failed');
      }
    };
    activate();
  }, [token, navigate]);

  return (
    <div className="max-w-md mx-auto py-32 text-center">
      <p className="text-xl text-gray-600">Processing activation...</p>
    </div>
  );
}

export default ActivateAccount;