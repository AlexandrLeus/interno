import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Blog from './pages/public/Blog';
import NotFound from './pages/public/NotFound';
import Post from './pages/public/Post';
import Project from './pages/public/Project';
import Login  from './pages/admin/Login';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ui/ProtectedRoute'; 
import Register from './pages/admin/Register';
import { CreatePost } from './pages/public/CreatePost';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="project" element={<Project />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<Post />} />
            <Route path="login" element={<Login />} />
            <Route path="admin/register" element={<ProtectedRoute requiredRole={'Admin'}><Register /></ProtectedRoute>} />
            <Route path="blog/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>}/> 
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}