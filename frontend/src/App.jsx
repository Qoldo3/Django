import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile.jsx';
import CreatePost from './pages/CreatePost.jsx';
import MyPosts from './pages/MyPosts.jsx';
import EditPost from './pages/EditPost.jsx';
import ActivateAccount from './pages/ActivateAccount.jsx';
import ActivationSuccess from './pages/ActivationSuccess';
import ActivationFailed from './pages/ActivationFailed';
import PasswordReset from './pages/PasswordReset';
import PasswordResetConfirm from './pages/PasswordResetConfirm';

function App() {
  // Reading progress bar (optional, keep it)
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/activate/:token" element={<ActivateAccount />} />
        <Route path="/activation-success" element={<ActivationSuccess />} />
        <Route path="/activation-failed" element={<ActivationFailed />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/password-reset/confirm/:token" element={<PasswordResetConfirm />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;