import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OpenAccountPage from './pages/OpenAccountPage';
import VerificationPage from './pages/VerificationPage';

const VERIFICATION_STORAGE_KEY = 'nexus-human-verified';

function isUserVerified() {
  return sessionStorage.getItem(VERIFICATION_STORAGE_KEY) === 'true';
}

function ProtectedRoute({ children }) {
  if (!isUserVerified()) {
    return <Navigate to="/verify" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/verify" element={<VerificationPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/open-account"
        element={
          <ProtectedRoute>
            <OpenAccountPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isUserVerified() ? '/' : '/verify'} replace />} />
    </Routes>
  );
}

export default App;