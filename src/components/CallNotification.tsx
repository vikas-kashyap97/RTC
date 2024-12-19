import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';

interface CallNotificationProps {
  caller: string;
  onAccept: () => void;
  onReject: () => void;
}

export function CallNotification({ caller, onAccept, onReject }: CallNotificationProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <p className="text-sm text-gray-600 mb-2">
        Incoming call from {caller}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600"
        >
          <Phone size={16} />
          Accept
        </button>
        <button
          onClick={onReject}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <PhoneOff size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}