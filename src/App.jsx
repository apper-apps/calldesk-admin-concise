import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Agents from '@/components/pages/Agents';
import Analytics from '@/components/pages/Analytics';
import Queues from '@/components/pages/Queues';
import Settings from '@/components/pages/Settings';
import CallLogs from '@/components/pages/CallLogs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-inter">
<Layout>
          <Routes>
            {/* Dashboard Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/sales-dashboard" element={<Analytics />} />
            
            {/* Deskphone Health */}
            <Route path="/deskphone-health" element={<Agents />} />
            
            {/* IVR Journey */}
            <Route path="/ivr-standard" element={<Settings />} />
            <Route path="/ivr-advance" element={<Settings />} />
            
            {/* Manage */}
            <Route path="/voice-template" element={<Settings />} />
            <Route path="/sms-templates" element={<Settings />} />
            <Route path="/sms-configuration" element={<Settings />} />
            
            {/* Voice Reach */}
            <Route path="/voice-broadcast" element={<Analytics />} />
            <Route path="/auto-dialer" element={<Analytics />} />
            <Route path="/auto-survey" element={<Analytics />} />
            <Route path="/desk-click" element={<Analytics />} />
            <Route path="/web-call-tracker" element={<Analytics />} />
            
            {/* Other Tools */}
            <Route path="/blacklist-number" element={<Settings />} />
            <Route path="/download-centre" element={<Settings />} />
            <Route path="/call-restriction" element={<Settings />} />
            
            {/* Profile & Billing */}
            <Route path="/profile-billing" element={<Settings />} />
            
            {/* API & Integration */}
            <Route path="/third-party-integration" element={<Settings />} />
            <Route path="/api-key" element={<Settings />} />
            <Route path="/webhook-integration" element={<Settings />} />
            
            {/* Settings */}
            <Route path="/notification-control" element={<Settings />} />
            <Route path="/security-activity" element={<Settings />} />
            
            {/* Header Menu Routes - Contact */}
            <Route path="/contact" element={<Agents />} />
            
            {/* Header Menu Routes - Report */}
<Route path="/call-logs" element={<CallLogs />} />
            <Route path="/voice-otp-logs" element={<Analytics />} />
            <Route path="/app-call-logs" element={<Analytics />} />
            
            {/* Header Menu Routes - User Management */}
            <Route path="/members" element={<Agents />} />
            <Route path="/call-groups" element={<Queues />} />
            <Route path="/member-analysis" element={<Analytics />} />
            
            {/* Header Menu Routes - Admin */}
            <Route path="/account" element={<Settings />} />
            
            {/* Legacy routes for compatibility */}
            <Route path="/agents" element={<Agents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/queues" element={<Queues />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
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
        />
      </div>
    </Router>
  );
}

export default App;