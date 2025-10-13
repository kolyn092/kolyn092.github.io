import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import MainHeader from './components/MainHeader';
import NewHomePage from './components/NewHomePage';
import Header from './components/Header';
import CoreSettings from './components/CoreSettings';
import GemManagement from './components/GemManagement';
import OptimizationButton from './components/OptimizationButton';
import Results from './components/Results';
import UserManagement from './pages/UserManagement';
import ApiTest from './pages/ApiTest';
import './styles/forms.css';
import './styles/main-layout.css';

function ArkGridOptimizer() {
  return (
    <AppProvider>
      <div className="container">
        <Header />
        <CoreSettings />
        <GemManagement />
        <OptimizationButton />
        <Results />
      </div>
    </AppProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <MainHeader />
        <Routes>
          <Route path="/" element={<NewHomePage />} />
          <Route path="/ark-grid-optimizer" element={<ArkGridOptimizer />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/api-test" element={<ApiTest />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
