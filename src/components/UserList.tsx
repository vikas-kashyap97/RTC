import React from 'react';
import { User } from '../types/audio';
import { useCallStore } from '../store/useCallStore';

interface UserListProps {
  users: User[];
  currentPeerId: string;
}

export function UserList({ users, currentPeerId }: UserListProps) {
  const { setRemotePeerId } = useCallStore();

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Online Users</h2>
      <div className="space-y-2">
        {users
          .filter(user => user.peerId !== currentPeerId)
          .map(user => (
            <button
              key={user.peerId}
              onClick={() => setRemotePeerId(user.peerId)}
              className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {user.username}
            </button>
          ))}
      </div>
    </div>
  );
}