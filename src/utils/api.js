const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Fetch current user
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

// Logout user
export async function logout() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Logout failed');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// Save game session
export async function saveGameSession(sessionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(sessionData)
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to save game session');
  } catch (error) {
    console.error('Error saving game session:', error);
    throw error;
  }
}

// Get leaderboard
export async function getLeaderboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch leaderboard');
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}