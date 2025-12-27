// PasswordReset.jsx — Request email
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/accounts/api/v1/password-reset/', { email });
      setMessage('If that email exists, a reset link has been sent.');
    } catch (err) {
      setMessage('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-32">
      <h1 className="text-4xl font-light text-gray-900 mb-12 text-center">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          Send Reset Link
        </button>
      </form>
      {message && <p className="text-center mt-8 text-green-600">{message}</p>}
      <p className="text-center mt-8">
        <Link to="/" className="text-indigo-600 hover:underline">← Home</Link>
      </p>
    </div>
  );
}

export default PasswordReset;