import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './components/HomePage';
import ArkGridHeader from './arkgrid/ArkGridHeader';
import CoreSettings from './arkgrid/CoreSettings';
import GemManagement from './arkgrid/GemManagement';
import OptimizationButton from './arkgrid/ArkGridOptimizationButton';
import Results from './arkgrid/ArkGridResults';
import ApiTest from './pages/ApiTest';
import CharacterInfo from './pages/CharacterInfo';
import './styles/forms.css';
import './styles/main-layout.css';

function ArkGridOptimizer() {
  return (
    <AppProvider>
      <div className="container">
        <ArkGridHeader />
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ark-grid-optimizer" element={<ArkGridOptimizer />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/character-info" element={<CharacterInfo />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
