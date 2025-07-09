'use client';

import { useState, useEffect } from 'react';
import { Task, User, TaskHistory } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, generateId, getInitials } from '@/lib/utils';

interface TaskModalProps {
  task: Task;
  nodeId: string;
  onUpdate: (task: Task, nodeId: string) => void;
  onCancel: () => void;
  currentUser: User;
}

export function TaskModal({ task, nodeId, onUpdate, onCancel, currentUser }: TaskModalProps) {
  const { t } = useLanguage();
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [noteText, setNoteText] = useState('');

  // Format for date inputs
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handle task update
  const handleUpdate = () => {
    const updatedTask = {
      ...editedTask,
      updatedAt: new Date().toISOString(),
    };

    onUpdate(updatedTask, nodeId);
    setIsOpen(false);
  };

  // Handle adding a note
  const handleAddNote = () => {
    if (!noteText.trim()) return;

    const newHistory: TaskHistory = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      user: currentUser.name,
      action: 'note',
      note: noteText,
    };

    setEditedTask({
      ...editedTask,
      history: [...editedTask.history, newHistory],
    });

    setNoteText('');
  };

  // Handle status change
  const handleStatusChange = (status: Task['status']) => {
    // Create history entry for status change
    const newHistory: TaskHistory = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      user: currentUser.name,
      action: 'status-change',
      previousStatus: editedTask.status,
      currentStatus: status,
    };

    setEditedTask({
      ...editedTask,
      status,
      history: [...editedTask.history, newHistory],
    });
  };

  // Handle progress change
  const handleProgressChange = (progress: number) => {
    // Only create history if progress has actually changed
    if (progress !== editedTask.progress) {
      const newHistory: TaskHistory = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        user: currentUser.name,
        action: 'progress-change',
        previousProgress: editedTask.progress,
        currentProgress: progress,
      };

      setEditedTask({
        ...editedTask,
        progress,
        history: [...editedTask.history, newHistory],
      });
    }
  };

  // Close and cancel handler
  const handleClose = () => {
    setIsOpen(false);
    onCancel();
  };

  // Get localized status text
  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'not-started':
        return t.notStarted;
      case 'in-progress':
        return t.inProgress;
      case 'completed':
        return t.completed;
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Input
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="font-bold text-lg"
              placeholder={t.taskTitle}
            />
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">{t.details}</TabsTrigger>
            <TabsTrigger value="progress">{t.progress}</TabsTrigger>
            <TabsTrigger value="history">{t.history}</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                placeholder={t.describeTask}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">{t.deadline}</Label>
              <Input
                id="deadline"
                type="date"
                value={formatDateForInput(editedTask.deadline)}
                onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">{t.assignedTo}</Label>
              <Input
                id="assignee"
                value={editedTask.assignedTo || ''}
                onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value || null })}
                placeholder={t.assigneePlaceholder}
              />
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="status">{t.status}</Label>
                <span className="text-sm font-medium">{getStatusText(editedTask.status)}</span>
              </div>
              <Select
                value={editedTask.status}
                onValueChange={(value: Task['status']) => handleStatusChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">{t.notStarted}</SelectItem>
                  <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                  <SelectItem value="completed">{t.completed}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="progress">{t.progress}</Label>
                <span className="text-sm font-medium">{editedTask.progress}%</span>
              </div>
              <Slider
                id="progress"
                defaultValue={[editedTask.progress]}
                max={100}
                step={5}
                onValueCommit={(value) => handleProgressChange(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">{t.addNote}</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={t.addNoteUpdate}
                  className="flex-1"
                />
                <Button onClick={handleAddNote} className="self-end">{t.add}</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 max-h-[300px] overflow-y-auto">
            {editedTask.history.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{t.noHistoryYet}</p>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {[...editedTask.history].reverse().map((event) => (
                  <div key={event.id} className="mb-4 ml-6 relative">
                    <div className="absolute -left-9 top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs text-white">
                        {event.action === 'created' ? '✓' :
                          event.action === 'status-change' ? '●' :
                            event.action === 'progress-change' ? '↑' : '✎'}
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{getInitials(event.user)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{event.user}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-sm">
                        {event.action === 'created' && t.createdTask}
                        {event.action === 'note' && event.note}
                        {event.action === 'status-change' && (
                          <span>
                            {t.changedStatusFrom} <span className="font-medium">{getStatusText(event.previousStatus as Task['status'])}</span> {t.to} <span className="font-medium">{getStatusText(event.currentStatus as Task['status'])}</span>
                          </span>
                        )}
                        {event.action === 'progress-change' && (
                          <span>
                            {t.updatedProgressFrom} <span className="font-medium">{event.previousProgress}%</span> {t.to} <span className="font-medium">{event.currentProgress}%</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>{t.cancel}</Button>
          <Button onClick={handleUpdate}>{t.saveChanges}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}