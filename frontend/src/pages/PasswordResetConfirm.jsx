// PasswordResetConfirm.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function PasswordResetConfirm() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password1) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/accounts/api/v1/password-reset/confirm/${token}/`, {
        new_password: password,
        new_password1: password1,
      });
      setMessage('Password reset successful! You can now log in.');
    } catch (err) {
      setMessage('Invalid or expired link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-32">
      <h1 className="text-4xl font-light text-gray-900 mb-12 text-center">Set New Password</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-indigo-500"
          required
        />
        <input
          type="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          Reset Password
        </button>
      </form>
      {message && (
        <p className={`text-center mt-8 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <p className="text-center mt-8">
        <Link to="/" className="text-indigo-600 hover:underline">← Home</Link>
      </p>
    </div>
  );
}

export default PasswordResetConfirm;