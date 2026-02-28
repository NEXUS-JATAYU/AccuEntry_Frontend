import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OpenAccountPage from './pages/OpenAccountPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/open-account" element={<OpenAccountPage />} />
    </Routes>
  );
}

export default App;
