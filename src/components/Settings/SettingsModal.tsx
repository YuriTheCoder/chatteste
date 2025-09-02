import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Database, Key, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { preferences, setPreferences } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [apiKey, setApiKey] = useState('');
  const [formData, setFormData] = useState({
    name: preferences.name || '',
    location: preferences.location || '',
    notificationsEnabled: preferences.notificationsEnabled ?? true,
    autoSave: preferences.autoSave ?? true,
    language: preferences.language || 'en',
  });

  useEffect(() => {
    const savedKey = storageService.getApiKey();
    if (savedKey) {
      setApiKey(savedKey.substring(0, 10) + '...');
    }
  }, []);

  const handleSave = () => {
    setPreferences({
      ...preferences,
      ...formData,
    });
    storageService.savePreferences({
      ...preferences,
      ...formData,
    });
    onOpenChange(false);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      storageService.clearAllData();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Database },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Manage your preferences and account settings
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mt-4">
          <div className="w-48 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Location</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Language</label>
                      <Select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        options={[
                          { value: 'en', label: 'English' },
                          { value: 'es', label: 'Spanish' },
                          { value: 'pt', label: 'Portuguese' },
                          { value: 'fr', label: 'French' },
                        ]}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Enable Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications for reminders and updates
                        </p>
                      </div>
                      <Switch
                        checked={formData.notificationsEnabled}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, notificationsEnabled: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Auto-save Conversations</p>
                        <p className="text-xs text-muted-foreground">
                          Automatically save chat history
                        </p>
                      </div>
                      <Switch
                        checked={formData.autoSave}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, autoSave: checked })
                        }
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">API Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Gemini API Key</label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          value={apiKey}
                          readOnly
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm">
                          <Key className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Data Management</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">Storage Used</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(JSON.stringify(localStorage).length / 1024)} KB of local storage
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleClearData}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;