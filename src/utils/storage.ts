export const saveClub = (club: any) => {
  const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
  clubs.push(club);
  localStorage.setItem('clubs', JSON.stringify(clubs));
};

export const getClubs = () => {
  return JSON.parse(localStorage.getItem('clubs') || '[]');
};

export const saveUser = (user: any) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const getUsers = () => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const setItem = async (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to local storage:', error);
    throw error;
  }
};

export const getItem = async (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error retrieving from local storage:', error);
    return null;
  }
};