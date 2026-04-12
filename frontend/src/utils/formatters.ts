export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatTime = (time: string): string => {
  return time.substring(0, 5);
};

export const formatDateTime = (date: string | Date, time: string): string => {
  return `${formatDate(date)} at ${formatTime(time)}`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
    case 'cancelled':
      return 'bg-red-500/15 text-red-400 border border-red-500/20';
    case 'completed':
      return 'bg-sky-500/15 text-sky-400 border border-sky-500/20';
    default:
      return 'bg-gray-500/15 text-gray-400 border border-gray-500/20';
  }
};

export const getLocationIcon = (location: string): string => {
  switch (location) {
    case 'window':
      return '🪟';
    case 'patio':
      return '🌳';
    case 'private':
      return '🔒';
    case 'indoor':
      return '🏠';
    default:
      return '📍';
  }
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  return Math.max(0, endMinutes - startMinutes);
};

export const getTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let i = 10; i < 22; i++) {
    slots.push(`${String(i).padStart(2, '0')}:00`);
    slots.push(`${String(i).padStart(2, '0')}:30`);
  }
  return slots;
};
