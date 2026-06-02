import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MonitorSmartphone, Wifi, WifiOff, Edit2, Trash2, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const DEVICE_TYPES = ['PC', 'Smart TV', 'Android Tablet', 'iPad', 'Raspberry Pi', 'Other'];

export default function Devices() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: () => api.get('/devices').then((r) => r.data),
    refetchInterval: 15000,
  });

  const devices = data?.data || [];
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openCreate = () => { reset({}); setEditing(null); setShowModal(true); };
  const openEdit = (d) => { reset(d); setEditing(d); setShowModal(true); };

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? api.put(`/devices/${editing.id}`, data) : api.post('/devices', data),
    onSuccess: () => { toast.success(editing ? 'Device updated' : 'Device registered'); qc.invalidateQueries({ queryKey: ['devices'] }); setShowModal(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/devices/${id}`),
    onSuccess: () => { toast.success('Device removed'); qc.invalidateQueries({ queryKey: ['devices'] }); },
  });

  const onlineCount = devices.filter((d) => d.status === 'ONLINE').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Device Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {onlineCount} of {devices.length} devices online
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Register Device
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-32" />
          ))
        ) : devices.length === 0 ? (
          <div className="col-span-3 card p-12 text-center">
            <MonitorSmartphone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No devices registered. Add your first device.</p>
          </div>
        ) : (
          devices.map((device) => (
            <div key={device.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${device.status === 'ONLINE' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <MonitorSmartphone className={`w-5 h-5 ${device.status === 'ONLINE' ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{device.name}</p>
                    <p className="text-xs text-gray-400">{device.deviceType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {device.status === 'ONLINE' ? (
                    <><Wifi className="w-3.5 h-3.5 text-green-500" /><span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span></>
                  ) : (
                    <><WifiOff className="w-3.5 h-3.5 text-gray-400" /><span className="text-xs text-gray-400">Offline</span></>
                  )}
                </div>
              </div>

              {device.location && (
                <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <MapPin className="w-3 h-3" /> {device.location}
                </p>
              )}

              {device.lastSeen && (
                <p className="text-xs text-gray-400">
                  Last seen {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                </p>
              )}

              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => openEdit(device)} className="flex-1 btn btn-secondary text-xs py-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => { if (confirm('Remove this device?')) deleteMutation.mutate(device.id); }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Device' : 'Register Device'}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <Input label="Device Name" placeholder="e.g. Library PC" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
          <div>
            <label className="label">Device Type</label>
            <select className="input" {...register('deviceType', { required: true })}>
              {DEVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Location (optional)" placeholder="e.g. Block A - Room 101" {...register('location')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saveMutation.isPending}>{editing ? 'Update' : 'Register'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
