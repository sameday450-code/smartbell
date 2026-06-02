import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Clock, Calendar,
  Volume2, Music, Upload, Play, Pause, Check, X as XIcon,
  Bell, Mic, VolumeX, ExternalLink, AlarmClock,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAY_LABELS = { MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu', FRI: 'Fri', SAT: 'Sat', SUN: 'Sun' };
const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const WEEKEND = ['SAT', 'SUN'];

// ── Compact audio picker for inside the modal ──────────────────────────────
function AudioPicker({ selectedId, onSelect, onGoToLibrary }) {
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['audio-files'],
    queryFn: () => api.get('/audio-files').then((r) => r.data.data),
  });

  const togglePlay = (e, file) => {
    e.stopPropagation();
    if (playingId === file.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(file.url);
      audioRef.current.onended = () => setPlayingId(null);
      audioRef.current.play();
      setPlayingId(file.id);
    }
  };

  if (isLoading) return (
    <div className="space-y-2">
      {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
    </div>
  );

  if (files.length === 0) return (
    <div className="text-center py-5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
      <Music className="w-7 h-7 text-gray-300 mx-auto mb-2" />
      <p className="text-xs text-gray-400 mb-2">No audio files in your library yet.</p>
      <button type="button" onClick={onGoToLibrary} className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 font-medium">
        <ExternalLink className="w-3 h-3" /> Go to Audio Library to upload
      </button>
    </div>
  );

  return (
    <div className="space-y-1.5">
      <div className="max-h-44 overflow-y-auto space-y-1.5 pr-0.5">
        {files.map((f) => (
          <div
            key={f.id}
            onClick={() => onSelect(f.id === selectedId ? null : f.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
              f.id === selectedId
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/25 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
            }`}
          >
            <button
              type="button"
              onClick={(e) => togglePlay(e, f)}
              className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
                f.id === selectedId
                  ? 'bg-primary-100 dark:bg-primary-800/50 text-primary-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              {playingId === f.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{f.name}</p>
              {f.mimeType && <p className="text-[10px] text-gray-400 uppercase">{f.mimeType.split('/')[1] || f.mimeType}</p>}
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              f.id === selectedId ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600'
            }`}>
              {f.id === selectedId && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onGoToLibrary} className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 pt-1 font-medium">
        <ExternalLink className="w-3 h-3" /> Manage Audio Library
      </button>
    </div>
  );
}

// ── Audio Library Full Panel (for the Library tab) ─────────────────────────
function AudioLibrary() {
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['audio-files'],
    queryFn: () => api.get('/audio-files').then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/audio-files/${id}`),
    onSuccess: () => { toast.success('Audio file deleted'); qc.invalidateQueries({ queryKey: ['audio-files'] }); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete'),
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('audio', file);
      fd.append('name', uploadName || file.name.replace(/\.[^.]+$/, ''));
      await api.post('/audio-files', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Audio uploaded');
      qc.invalidateQueries({ queryKey: ['audio-files'] });
      setUploadName('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const togglePlay = (file) => {
    if (playingId === file.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(file.url);
      audioRef.current.onended = () => setPlayingId(null);
      audioRef.current.play();
      setPlayingId(file.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="input flex-1 text-sm"
            placeholder="Give it a name (optional)"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
          />
          <label className={`btn btn-primary px-4 py-2 text-sm flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading…' : 'Upload'}
            <input ref={fileRef} type="file" accept=".mp3,.wav,.ogg" className="hidden" onChange={handleUpload} />
          </label>
        </div>
        <p className="text-xs text-gray-400">Supports MP3, WAV, OGG · Max 50MB</p>
      </div>

      {/* File list */}
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)
        ) : files.length === 0 ? (
          <div className="text-center py-10">
            <Music className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No audio files yet. Upload your first bell sound above.</p>
          </div>
        ) : (
          files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800/60 transition-colors group">
              <button
                type="button"
                onClick={() => togglePlay(f)}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-100 transition-colors"
              >
                {playingId === f.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">
                  {f.mimeType?.split('/')[1]?.toUpperCase() || 'AUDIO'}
                  {f.fileSize ? ` · ${(f.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { if (confirm(`Delete "${f.name}"?`)) deleteMutation.mutate(f.id); }}
                className="p-2 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Section label helper ──────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{children}</span>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Timetable() {
  const [tab, setTab] = useState('schedules');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [audioSource, setAudioSource] = useState('none'); // 'library' | 'tts' | 'none'
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => api.get('/schedules').then((r) => r.data.data),
  });

  const schedules = data?.schedules || [];

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      repeatCount: 2, volume: 1.0, isActive: true,
      generateTts: false, audioFileId: null,
    },
  });

  const volume = watch('volume', 1.0);
  const audioFileId = watch('audioFileId', null);
  const days = watch('days', WEEKDAYS);

  const openCreate = () => {
    reset({ days: WEEKDAYS, repeatCount: 2, volume: 1.0, isActive: true, generateTts: false, audioFileId: null });
    setAudioSource('none');
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (s) => {
    reset({ ...s, audioFileId: s.audioFileId || null });
    setAudioSource(s.audioFileId ? 'library' : (s.audioUrl ? 'tts' : 'none'));
    setEditing(s);
    setShowModal(true);
  };

  const handleSourceChange = (src) => {
    setAudioSource(src);
    if (src !== 'library') setValue('audioFileId', null);
    setValue('generateTts', src === 'tts');
  };

  const saveMutation = useMutation({
    mutationFn: (formData) => editing
      ? api.put(`/schedules/${editing.id}`, formData)
      : api.post('/schedules', formData),
    onSuccess: () => {
      toast.success(editing ? 'Schedule updated' : 'Schedule created');
      qc.invalidateQueries({ queryKey: ['schedules'] });
      setShowModal(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/schedules/${id}`),
    onSuccess: () => { toast.success('Schedule deleted'); qc.invalidateQueries({ queryKey: ['schedules'] }); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => api.patch(`/schedules/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  });

  const getAudioLabel = (schedule) => {
    if (schedule.audioFile) return schedule.audioFile.name;
    if (schedule.audioUrl) return 'TTS voice';
    return null;
  };

  const setDaysPreset = (preset) => {
    if (preset === 'weekdays') setValue('days', WEEKDAYS);
    else if (preset === 'all') setValue('days', DAYS);
    else if (preset === 'weekend') setValue('days', WEEKEND);
  };

  const audioSourceOptions = [
    {
      id: 'library',
      icon: <Music className="w-4 h-4" />,
      label: 'Audio File',
      desc: 'Pick from your library',
      color: 'text-primary-600',
      bg: 'bg-primary-50 dark:bg-primary-900/25',
    },
    {
      id: 'tts',
      icon: <Mic className="w-4 h-4" />,
      label: 'Text-to-Speech',
      desc: 'Auto-generate voice',
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/25',
    },
    {
      id: 'none',
      icon: <VolumeX className="w-4 h-4" />,
      label: 'No Sound',
      desc: 'Notification only',
      color: 'text-gray-500',
      bg: 'bg-gray-100 dark:bg-gray-800',
    },
  ];

  // Derived day preset label
  const daysArr = days || [];
  const daysPreset = daysArr.length === 7 ? 'All' : daysArr.length === 5 && !daysArr.includes('SAT') && !daysArr.includes('SUN') ? 'Weekdays' : `${daysArr.length}d`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage bell schedules and automated announcements</p>
        </div>
        {tab === 'schedules' && (
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4" /> Add Schedule
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'schedules', label: 'Bell Schedules', icon: <Calendar className="w-4 h-4" /> },
          { key: 'library', label: 'Audio Library', icon: <Music className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Schedules Tab ── */}
      {tab === 'schedules' && (
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-4 animate-pulse h-20" />)
          ) : schedules.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlarmClock className="w-8 h-8 text-primary-400" />
              </div>
              <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">No schedules yet</p>
              <p className="text-sm text-gray-400 mb-4">Add your first bell schedule to get started.</p>
              <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Add Schedule</Button>
            </div>
          ) : (
            schedules.map((s) => {
              const audioLabel = getAudioLabel(s);
              return (
                <div key={s.id} className={`card p-4 flex items-center gap-4 transition-opacity ${!s.isActive ? 'opacity-50' : ''}`}>
                  <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary-500 mb-0.5" />
                    <span className="text-sm font-bold text-primary-700 dark:text-primary-300 tabular-nums">{s.scheduledTime}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{s.title}</h3>
                      <Badge variant={s.isActive ? 'green' : 'gray'}>{s.isActive ? 'Active' : 'Disabled'}</Badge>
                      {s.isDefault && <Badge variant="blue">Default</Badge>}
                    </div>
                    {s.announcementText && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{s.announcementText}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {s.days?.map((d) => (
                        <span key={d} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded font-medium">{DAY_LABELS[d]}</span>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">× {s.repeatCount}</span>
                      {audioLabel && (
                        <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded font-medium ml-1">
                          <Music className="w-2.5 h-2.5" />{audioLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleMutation.mutate(s.id)} className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      {s.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm('Delete this schedule?')) deleteMutation.mutate(s.id); }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Audio Library Tab ── */}
      {tab === 'library' && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Audio Library</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upload audio files to use as bell sounds in schedules</p>
            </div>
          </div>
          <AudioLibrary />
        </div>
      )}

      {/* ── Create/Edit Modal ── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Bell Schedule' : 'New Bell Schedule'}
        subtitle={editing ? `Editing: ${editing.title}` : 'Configure when and how the bell rings'}
        icon={<Bell className="w-4 h-4 text-primary-600" />}
        size="xl"
        footer={
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary-600" {...register('isActive')} />
              Enable schedule immediately
            </label>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" form="schedule-form" loading={saveMutation.isPending}>
                {editing ? 'Save Changes' : 'Create Schedule'}
              </Button>
            </div>
          </div>
        }
      >
        <form id="schedule-form" onSubmit={handleSubmit((d) => saveMutation.mutate(d))}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">

            {/* ── LEFT COLUMN ── */}
            <div className="space-y-4">
              <SectionLabel>Schedule Details</SectionLabel>

              <Input
                label="Schedule Title"
                placeholder="e.g. Morning Break, Assembly, End of Day"
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> Bell Time
                  </label>
                  <input
                    type="time"
                    className="input"
                    {...register('scheduledTime', { required: 'Time is required' })}
                  />
                  {errors.scheduledTime && <p className="mt-1 text-xs text-red-500">{errors.scheduledTime.message}</p>}
                </div>
                <div>
                  <label className="label">Repeat</label>
                  <div className="relative">
                    <input
                      type="number" min={1} max={5}
                      className="input"
                      {...register('repeatCount', { required: true, min: 1, max: 5 })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">times</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Announcement Text</label>
                <textarea
                  className="input min-h-[80px] resize-none"
                  placeholder="e.g. Attention please, it's now break time."
                  {...register('announcementText', { required: 'Announcement text is required' })}
                />
                {errors.announcementText && <p className="mt-1 text-xs text-red-500">{errors.announcementText.message}</p>}
              </div>

              {/* Days */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Active Days</label>
                  <div className="flex gap-1">
                    {[
                      { key: 'weekdays', label: 'Weekdays' },
                      { key: 'weekend', label: 'Weekend' },
                      { key: 'all', label: 'All' },
                    ].map((p) => (
                      <button
                        key={p.key} type="button"
                        onClick={() => setDaysPreset(p.key)}
                        className="text-[10px] px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors font-medium"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Controller
                  name="days"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS.map((d) => {
                        const active = (field.value || []).includes(d);
                        return (
                          <button
                            key={d} type="button"
                            onClick={() => {
                              const cur = field.value || [];
                              field.onChange(active ? cur.filter((x) => x !== d) : [...cur, d]);
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                              active
                                ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-300 hover:text-primary-600'
                            }`}
                          >
                            {DAY_LABELS[d]}
                          </button>
                        );
                      })}
                      <span className="self-center text-xs text-gray-400 ml-1">{daysPreset}</span>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-4 lg:border-l lg:border-gray-100 lg:dark:border-gray-800 lg:pl-8 mt-6 lg:mt-0">
              <SectionLabel>Bell Sound</SectionLabel>

              {/* Source selector — 3 cards */}
              <div className="grid grid-cols-3 gap-2">
                {audioSourceOptions.map((opt) => {
                  const active = audioSource === opt.id;
                  return (
                    <button
                      key={opt.id} type="button"
                      onClick={() => handleSourceChange(opt.id)}
                      className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 transition-all text-center ${
                        active
                          ? `border-primary-400 ${opt.bg} shadow-sm`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`${active ? opt.color : 'text-gray-400'} transition-colors`}>
                        {opt.icon}
                      </div>
                      <span className={`text-xs font-semibold leading-tight ${active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-tight">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Source content */}
              <div className="min-h-[140px]">
                {audioSource === 'library' && (
                  <AudioPicker
                    selectedId={audioFileId}
                    onSelect={(id) => setValue('audioFileId', id)}
                    onGoToLibrary={() => { setShowModal(false); setTab('library'); }}
                  />
                )}
                {audioSource === 'tts' && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                    <Mic className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-violet-800 dark:text-violet-300">Text-to-Speech enabled</p>
                      <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
                        The announcement text will be converted to speech and played at the scheduled time using the browser's voice engine.
                      </p>
                    </div>
                  </div>
                )}
                {audioSource === 'none' && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <VolumeX className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No audio playback</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        The bell will trigger and log the announcement, but no sound will be played.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Volume */}
              <div className="pt-1">
                <SectionLabel>Playback Volume</SectionLabel>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <input
                      type="range" min="0" max="1" step="0.05"
                      className="w-full accent-primary-600 cursor-pointer h-2"
                      {...register('volume')}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>Silent</span>
                      <span>Max</span>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
