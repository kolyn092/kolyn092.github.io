import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './components/HomePage';
import Header from './components/Header';
import CoreSettings from './components/CoreSettings';
import GemManagement from './components/GemManagement';
import OptimizationButton from './components/OptimizationButton';
import Results from './components/Results';

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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ark-grid-optimizer" element={<ArkGridOptimizer />} />
      </Routes>
    </Router>
  );
}

export default App;
