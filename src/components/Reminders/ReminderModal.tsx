import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '../../services/storageService';
import type { Reminder } from '../../services/storageService';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

interface ReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ open, onOpenChange }) => {
  const { addNotification } = useNotifications();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    if (open) {
      loadReminders();
    }
  }, [open]);

  useEffect(() => {
    // Check for due reminders every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  const loadReminders = () => {
    const storedReminders = storageService.getReminders();
    setReminders(storedReminders);
  };

  const checkReminders = () => {
    const now = new Date();
    reminders.forEach((reminder) => {
      if (!reminder.completed) {
        const reminderTime = new Date(reminder.datetime);
        if (reminderTime <= now) {
          // Trigger notification
          addNotification({
            title: 'Reminder',
            message: reminder.title,
            type: 'reminder',
          });
          
          // Mark as completed
          reminder.completed = true;
          storageService.saveReminder(reminder);
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) return;

    const datetime = `${formData.date}T${formData.time}`;
    const reminder: Reminder = {
      id: `reminder_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      datetime,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    storageService.saveReminder(reminder);
    setReminders([...reminders, reminder]);
    
    // Reset form
    setFormData({ title: '', description: '', date: '', time: '' });
    setShowForm(false);

    // Schedule notification
    const reminderTime = new Date(datetime);
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();
    
    if (delay > 0) {
      setTimeout(() => {
        addNotification({
          title: 'Reminder',
          message: reminder.title,
          type: 'reminder',
        });
      }, delay);
    }
  };

  const handleDelete = (id: string) => {
    storageService.deleteReminder(id);
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isOverdue = (datetime: string) => {
    return new Date(datetime) < new Date();
  };

  // Sort reminders: upcoming first, then completed
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminders
          </DialogTitle>
          <DialogDescription>
            Set reminders and never miss important tasks
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Reminder
            </Button>
          ) : (
            <Card className="p-4 mb-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Reminder title"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Description (optional)</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add more details..."
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground">Time</label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Create Reminder
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ title: '', description: '', date: '', time: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <ScrollArea className="h-[400px]">
            {sortedReminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Clock className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No reminders set</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {sortedReminders.map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Card className={cn(
                        "p-3",
                        reminder.completed && "opacity-60"
                      )}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={cn(
                                "font-medium text-sm",
                                reminder.completed && "line-through"
                              )}>
                                {reminder.title}
                              </p>
                              {reminder.completed ? (
                                <Badge variant="secondary" className="text-xs">
                                  Completed
                                </Badge>
                              ) : isOverdue(reminder.datetime) ? (
                                <Badge variant="destructive" className="text-xs">
                                  Overdue
                                </Badge>
                              ) : (
                                <Badge variant="success" className="text-xs">
                                  Upcoming
                                </Badge>
                              )}
                            </div>
                            
                            {reminder.description && (
                              <p className="text-xs text-muted-foreground mb-2">
                                {reminder.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDateTime(reminder.datetime)}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(reminder.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderModal;