import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Megaphone, Clock, Radio } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';

const EMERGENCY_TYPES = [
  { value: 'FIRE_ALERT', label: '🔥 Fire Alert', color: 'red' },
  { value: 'SECURITY_ALERT', label: '🔒 Security Alert', color: 'orange' },
  { value: 'MEDICAL_EMERGENCY', label: '🏥 Medical Emergency', color: 'purple' },
  { value: 'LOCKDOWN', label: '⚠️ Lockdown', color: 'yellow' },
  { value: 'CUSTOM', label: '📢 Custom Message', color: 'blue' },
];

export default function Announcements() {
  const [showEmergency, setShowEmergency] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const { hasRole } = useAuthStore();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => api.get('/announcements?limit=20').then((r) => r.data),
  });

  const announcements = data?.data || [];

  const emergencyForm = useForm();
  const manualForm = useForm();

  const emergencyMutation = useMutation({
    mutationFn: (data) => api.post('/announcements/emergency', data),
    onSuccess: () => {
      toast.success('Emergency broadcast sent!');
      setShowEmergency(false);
      qc.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to broadcast'),
  });

  const manualMutation = useMutation({
    mutationFn: (data) => api.post('/announcements/manual', data),
    onSuccess: () => {
      toast.success('Announcement triggered!');
      setShowManual(false);
      qc.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to trigger'),
  });

  const typeVariant = { SCHEDULED: 'blue', EMERGENCY: 'red', MANUAL: 'green' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">History and controls for all announcements</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowManual(true)} variant="outline" size="sm">
            <Megaphone className="w-4 h-4" /> Manual
          </Button>
          {hasRole('SCHOOL_ADMIN') && (
            <Button onClick={() => setShowEmergency(true)} variant="danger" size="sm">
              <AlertTriangle className="w-4 h-4" /> Emergency
            </Button>
          )}
        </div>
      </div>

      {/* Announcement list */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Announcement History</h2>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="py-12 text-center">
            <Radio className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No announcements recorded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.type === 'EMERGENCY' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                  {a.type === 'EMERGENCY' ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Megaphone className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{a.title}</p>
                    <Badge variant={typeVariant[a.type] || 'gray'}>{a.type}</Badge>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{a.announcementText}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">{format(new Date(a.playedAt), 'MMM d')}</p>
                  <p className="text-xs text-gray-400">{format(new Date(a.playedAt), 'h:mm a')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Modal */}
      <Modal open={showEmergency} onClose={() => setShowEmergency(false)} title="Emergency Broadcast" size="md">
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            This will instantly broadcast to ALL connected devices
          </p>
        </div>
        <form onSubmit={emergencyForm.handleSubmit((d) => emergencyMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="label">Emergency Type</label>
            <div className="grid grid-cols-1 gap-2">
              {EMERGENCY_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-red-400 has-[:checked]:border-red-500 has-[:checked]:bg-red-50 dark:has-[:checked]:bg-red-900/20 transition-colors">
                  <input type="radio" value={type.value} {...emergencyForm.register('emergencyType', { required: true })} className="text-red-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {emergencyForm.watch('emergencyType') === 'CUSTOM' && (
            <div>
              <label className="label">Custom Message</label>
              <textarea className="input min-h-20 resize-none" placeholder="Enter emergency message..." {...emergencyForm.register('customText', { required: 'Message is required for custom type' })} />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowEmergency(false)}>Cancel</Button>
            <Button type="submit" variant="danger" loading={emergencyMutation.isPending}>
              <AlertTriangle className="w-4 h-4" /> Broadcast Now
            </Button>
          </div>
        </form>
      </Modal>

      {/* Manual Announcement Modal */}
      <Modal open={showManual} onClose={() => setShowManual(false)} title="Manual Announcement">
        <form onSubmit={manualForm.handleSubmit((d) => manualMutation.mutate(d))} className="space-y-4">
          <Input label="Title" placeholder="e.g. Staff Meeting Reminder" {...manualForm.register('title', { required: true })} />
          <div>
            <label className="label">Announcement Text</label>
            <textarea className="input min-h-24 resize-none" placeholder="Attention please..." {...manualForm.register('announcementText', { required: true })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowManual(false)}>Cancel</Button>
            <Button type="submit" loading={manualMutation.isPending}>
              <Megaphone className="w-4 h-4" /> Announce
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
