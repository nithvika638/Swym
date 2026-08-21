import { useState, useEffect } from 'react';

const STORAGE_KEY_USERS = 'apex_store_users_v1';
const STORAGE_KEY_ACTIVE_USER = 'apex_store_active_user_id_v1';

export const DEFAULT_USERS = [
  { id: 'user-alex', name: 'Alex Johnson', email: 'alex@example.com', color: 'indigo', avatar: '👨‍💻' },
  { id: 'user-sarah', name: 'Sarah Miller', email: 'sarah@example.com', color: 'rose', avatar: '👩‍🎨' },
  { id: 'user-jordan', name: 'Jordan Lee', email: 'jordan@example.com', color: 'emerald', avatar: '⚡' }
];

export function useUserAccounts() {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load users from localStorage:", e);
    }
    return DEFAULT_USERS;
  });

  const [activeUserId, setActiveUserId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      if (saved && users.some(u => u.id === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn("Failed to load active user ID:", e);
    }
    return users[0]?.id || DEFAULT_USERS[0].id;
  });

  // Ensure activeUserId remains valid
  useEffect(() => {
    if (!users.some(u => u.id === activeUserId)) {
      setActiveUserId(users[0]?.id || DEFAULT_USERS[0].id);
    }
  }, [users, activeUserId]);

  // Persist users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users:", e);
    }
  }, [users]);

  // Persist active user ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, activeUserId);
    } catch (e) {
      console.error("Failed to save active user ID:", e);
    }
  }, [activeUserId]);

  const activeUser = users.find(u => u.id === activeUserId) || users[0];

  const handleAddUser = (name) => {
    const cleanName = (name || '').trim() || `User ${users.length + 1}`;
    const colors = ['indigo', 'rose', 'emerald', 'amber', 'purple', 'sky'];
    const avatars = ['👤', '🌟', '🚀', '🎨', '💼', '🎧'];
    
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      email: `${cleanName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      color: colors[users.length % colors.length],
      avatar: avatars[users.length % avatars.length]
    };

    setUsers(prev => [...prev, newUser]);
    setActiveUserId(newUser.id);
    return newUser;
  };

  const handleSwitchUser = (userId) => {
    if (users.some(u => u.id === userId)) {
      setActiveUserId(userId);
    }
  };

  return {
    users,
    activeUserId,
    activeUser,
    switchUser: handleSwitchUser,
    addUser: handleAddUser
  };
}
