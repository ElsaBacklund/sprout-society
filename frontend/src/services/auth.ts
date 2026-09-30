export interface StoredUser {
  id: string;
  name: string;
  email: string;
  level: "grundpaket" | "plus" | "fullstandigt";
  levelName: string;
  isAdmin: boolean;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function saveSession(token: string, user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateStoredUser(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}