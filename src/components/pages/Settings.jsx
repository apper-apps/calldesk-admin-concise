import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    companyName: 'Calldesk Solutions',
    timezone: 'America/New_York',
    language: 'English',
    currency: 'USD',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    autoRecording: true,
    recordingRetention: '90',
    qualityMonitoring: true,
    realTimeReporting: true,
    apiKey: 'cd_live_********************************',
    webhookUrl: 'https://api.calldesk.com/webhooks',
    maxConcurrentCalls: '100',
    callTimeout: '30',
    queueTimeout: '300'
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'calls', label: 'Call Settings', icon: 'Phone' },
    { id: 'integrations', label: 'Integrations', icon: 'Plug' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Simulate saving settings
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to default values
    toast.info('Settings reset to default values');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name"
          value={settings.companyName}
          onChange={(e) => handleSettingChange('companyName', e.target.value)}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full bg-surface border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full bg-surface border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Currency
          </label>
          <select
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value)}
            className="w-full bg-surface border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Mail" size={20} className="text-primary" />
            <div>
              <h4 className="font-medium text-white">Email Notifications</h4>
              <p className="text-sm text-slate-400">Receive notifications via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ApperIcon name="MessageSquare" size={20} className="text-primary" />
            <div>
              <h4 className="font-medium text-white">SMS Notifications</h4>
              <p className="text-sm text-slate-400">Receive notifications via SMS</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Bell" size={20} className="text-primary" />
            <div>
              <h4 className="font-medium text-white">Push Notifications</h4>
              <p className="text-sm text-slate-400">Receive push notifications in browser</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderCallSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Mic" size={20} className="text-primary" />
            <div>
              <h4 className="font-medium text-white">Auto Recording</h4>
              <p className="text-sm text-slate-400">Automatically record all calls</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoRecording}
              onChange={(e) => handleSettingChange('autoRecording', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Shield" size={20} className="text-primary" />
            <div>
              <h4 className="font-medium text-white">Quality Monitoring</h4>
              <p className="text-sm text-slate-400">Enable quality monitoring features</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.qualityMonitoring}
              onChange={(e) => handleSettingChange('qualityMonitoring', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Recording Retention (days)"
          type="number"
          value={settings.recordingRetention}
          onChange={(e) => handleSettingChange('recordingRetention', e.target.value)}
        />
        <Input
          label="Max Concurrent Calls"
          type="number"
          value={settings.maxConcurrentCalls}
          onChange={(e) => handleSettingChange('maxConcurrentCalls', e.target.value)}
        />
        <Input
          label="Call Timeout (seconds)"
          type="number"
          value={settings.callTimeout}
          onChange={(e) => handleSettingChange('callTimeout', e.target.value)}
        />
        <Input
          label="Queue Timeout (seconds)"
          type="number"
          value={settings.queueTimeout}
          onChange={(e) => handleSettingChange('queueTimeout', e.target.value)}
        />
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-white mb-4">API Configuration</h4>
        <div className="space-y-4">
          <Input
            label="API Key"
            value={settings.apiKey}
            onChange={(e) => handleSettingChange('apiKey', e.target.value)}
            type="password"
          />
          <Input
            label="Webhook URL"
            value={settings.webhookUrl}
            onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-white mb-4">Integrations</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Slack" size={20} className="text-primary" />
              </div>
              <div>
                <h5 className="font-medium text-white">Slack</h5>
                <p className="text-sm text-slate-400">Send notifications to Slack</p>
              </div>
            </div>
            <Button size="small" variant="secondary">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Database" size={20} className="text-success" />
              </div>
              <div>
                <h5 className="font-medium text-white">CRM Integration</h5>
                <p className="text-sm text-slate-400">Connect to your CRM system</p>
              </div>
            </div>
            <Button size="small" variant="secondary">
              Configure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'calls':
        return renderCallSettings();
      case 'integrations':
        return renderIntegrationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Configure your call center settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  activeTab === tab.id
                    ? 'bg-primary text-white border-l-4 border-l-accent'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ApperIcon name={tab.icon} size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-surface rounded-lg p-6 border border-slate-700">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;