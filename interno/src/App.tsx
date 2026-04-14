import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Blog from './pages/public/Blog';
import NotFound from './pages/public/NotFound';
import Post from './pages/public/Post';
import Project from './pages/public/Project';
import Profile from './pages/public/Profile';
import { AuthProvider } from './auth/AuthProvider';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import MyPosts from './pages/public/MyPosts';
import CreatePost from './pages/public/CreatePost';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { ThemeProviderWrapper } from './contexts/ThemeContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProviderWrapper>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="project" element={<Project />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<Post />} />
            <Route path="my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="blog/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </ThemeProviderWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}