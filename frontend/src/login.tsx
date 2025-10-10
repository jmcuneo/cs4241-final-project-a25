import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

function Login() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/user`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  if (user) {
    return (
      <div>
        <h1>Login Successful! Welcome, {user.displayName || user.nickname}</h1>
        <a href="/home">Go to Home</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Login Page</h1>
      <a href={`${API_URL}/login`}>
        <button>Login with Auth0</button>
      </a>
    </div>
  );
}

export default Login;