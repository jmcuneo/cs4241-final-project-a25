import { useEffect, useState } from "react";

function Login() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  if (user) {
    return <h1>Login Successful! Welcome, {user.displayName || user.nickname}</h1>;
  }

  return (
    <div>
      <h1>Login Page</h1>
      <a href="http://localhost:3000/login">
        <button>Login with Auth0</button>
      </a>
    </div>
  );
}

export default Login;