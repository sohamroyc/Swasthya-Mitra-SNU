import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import LandingPage from './pages/LandingPage';
import AiSymptomCheckerInterface from './pages/AiSymptomCheckerInterface';
import AiXRayAnalysisTool from './pages/AiXRayAnalysisTool';
import EmergencyClinicLocator from './pages/EmergencyClinicLocator';
import FirstAidKnowledgeBase from './pages/FirstAidKnowledgeBase';
import HealthReportsAnalytics from './pages/HealthReportsAnalytics';
import MainWellnessDashboard from './pages/MainWellnessDashboard';
import MedicationManagerCalendar from './pages/MedicationManagerCalendar';
import PatientProfileRecords from './pages/PatientProfileRecords';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import MyHealthOverview from './pages/MyHealthOverview';
import AiDermatologist from './pages/AiDermatologist';
import GovernmentHealthSchemes from './pages/GovernmentHealthSchemes';
import PricingPage from './pages/PricingPage';
import ManageSubscription from './pages/ManageSubscription';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import PremiumGate from './components/PremiumGate';
import FloatingChatbotProvider from './components/FloatingChatbotProvider';

const LayoutContainer = ({ children }) => {
  const location = useLocation();
  const showChatbot = location.pathname !== '/';

  return (
    <div className="relative">
      {showChatbot ? (
        <FloatingChatbotProvider>
          {children}
        </FloatingChatbotProvider>
      ) : (
        children
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <LayoutContainer>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/create-account" element={<PublicRoute><CreateAccountPage /></PublicRoute>} />
              <Route path="/ai-symptom-checker-interface" element={<ProtectedRoute><AiSymptomCheckerInterface /></ProtectedRoute>} />
              <Route path="/ai-x-ray-analysis-tool" element={<ProtectedRoute><AiXRayAnalysisTool /></ProtectedRoute>} />
              <Route path="/emergency-clinic-locator" element={<ProtectedRoute><EmergencyClinicLocator /></ProtectedRoute>} />
              <Route path="/first-aid-knowledge-base" element={<ProtectedRoute><FirstAidKnowledgeBase /></ProtectedRoute>} />
              <Route path="/health-reports-analytics" element={<ProtectedRoute><HealthReportsAnalytics /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><MainWellnessDashboard /></ProtectedRoute>} />
              <Route path="/main-wellness-dashboard" element={<ProtectedRoute><MainWellnessDashboard /></ProtectedRoute>} />
              <Route path="/medication-manager-calendar" element={<ProtectedRoute><MedicationManagerCalendar /></ProtectedRoute>} />
              <Route path="/patient-profile-records" element={<ProtectedRoute><PatientProfileRecords /></ProtectedRoute>} />
              <Route path="/my-health" element={<ProtectedRoute><MyHealthOverview /></ProtectedRoute>} />
              <Route path="/ai-dermatologist" element={<ProtectedRoute><PremiumGate feature="ai_dermatologist"><AiDermatologist /></PremiumGate></ProtectedRoute>} />
              <Route path="/government-health-schemes" element={<ProtectedRoute><GovernmentHealthSchemes /></ProtectedRoute>} />
              <Route path="/subscription" element={<ProtectedRoute><ManageSubscription /></ProtectedRoute>} />
              <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
              <Route path="/checkout/cancel" element={<ProtectedRoute><CheckoutCancel /></ProtectedRoute>} />
            </Routes>
          </LayoutContainer>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
