import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/Layout';
import { routeArray } from '@/config/routes';
import NotFoundPage from '@/components/pages/NotFoundPage';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
        
        <Routes>
          <Route path="/" element={<Layout />}>
            {routeArray.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
<Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;