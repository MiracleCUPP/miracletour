import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="relative inline-block">
      <Bell className="w-5 h-5 text-white" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        {count > 9 ? '9+' : count}
      </span>
    </div>
  );
};

export default NotificationBadge;