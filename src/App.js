import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import CoreSettings from './components/CoreSettings';
import GemManagement from './components/GemManagement';
import OptimizationButton from './components/OptimizationButton';
import Results from './components/Results';

function App() {
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

export default App;
