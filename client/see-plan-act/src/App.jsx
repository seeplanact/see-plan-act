import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext.jsx';

// Lazy-load admin pages (code-split — not loaded for regular users)
const AdminLogin      = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminLayout     = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminBlogList   = lazy(() => import('./pages/admin/AdminBlogList.jsx'));
const AdminBlogForm   = lazy(() => import('./pages/admin/AdminBlogForm.jsx'));
const AdminCourseList = lazy(() => import('./pages/admin/AdminCourseList.jsx'));
const AdminCourseForm = lazy(() => import('./pages/admin/AdminCourseForm.jsx'));
const AdminContacts   = lazy(() => import('./pages/admin/AdminContacts.jsx'));

const AdminSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-brand-border border-t-brand-cyan rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAdminAuth();
  if (loading) return <AdminSpinner />;
  return isAuth ? children : <Navigate to="/admin/login" replace />;
};

const PublicAdminRoute = ({ children }) => {
  const { isAuth, loading } = useAdminAuth();
  if (loading) return <AdminSpinner />;
  return isAuth ? <Navigate to="/admin" replace /> : children;
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AdminAuthProvider>
      {isAdminRoute ? (
        <Suspense fallback={<AdminSpinner />}>
          <Routes>
            <Route path="/admin/login" element={
              <PublicAdminRoute><AdminLogin /></PublicAdminRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute><AdminLayout /></ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="blogs" element={<AdminBlogList />} />
              <Route path="blogs/new" element={<AdminBlogForm />} />
              <Route path="blogs/:id/edit" element={<AdminBlogForm />} />
              <Route path="courses" element={<AdminCourseList />} />
              <Route path="courses/new" element={<AdminCourseForm />} />
              <Route path="courses/:id/edit" element={<AdminCourseForm />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>
          </Routes>
        </Suspense>
      ) : (
        <div className="flex flex-col min-h-screen bg-black">
          <Navbar />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/"               element={<Home />} />
                <Route path="/about"          element={<About />} />
                <Route path="/courses"        element={<Courses />} />
                <Route path="/courses/:slug"  element={<CourseDetail />} />
                <Route path="/blogs"          element={<Blogs />} />
                <Route path="/blogs/:slug"    element={<BlogPost />} />
                <Route path="/contact"        element={<Contact />} />
                <Route path="*"               element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      )}
    </AdminAuthProvider>
  );
};

export default App;