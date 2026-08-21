import { dbService } from './dbService';

export const authService = {
  getCurrentUser() {
    const session = dbService.getSession();
    if (!session || !session.userId) return null;

    const users = dbService.getUsers();
    return users.find(u => u.id === session.userId) || null;
  },

  signUp(name, email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      throw new Error("All fields (Name, Email, Password) are required.");
    }

    if (cleanPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const users = dbService.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error("An account with this email already exists. Please Sign In.");
    }

    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword, // Stored in database
      role: 'user',
      createdAt: new Date().toISOString()
    };

    dbService.saveUser(newUser);
    dbService.setSession({ userId: newUser.id });
    return newUser;
  },

  signIn(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error("Please enter both Email and Password.");
    }

    const users = dbService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error("No account found with this email address. Please Sign Up.");
    }

    if (user.password !== cleanPassword) {
      throw new Error("Incorrect password. Please try again.");
    }

    dbService.setSession({ userId: user.id });
    return user;
  },

  signOut() {
    dbService.setSession(null);
  }
};
