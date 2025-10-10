"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button, TextField, Typography, Box } from "@mui/material";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.body.style.overflowY = "hidden";
        return () => {
            document.body.style.overflowY = "auto";
        };
    }, []);

    const handleLogin = async () => {
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            alert("Invalid Username or Password");
        } else {
            router.push("/");
        }
    };

    const handleCreateAccountClick = () => {
        router.push("/signup");
    };

    return (
        <Box display="flex" height="100vh" overflow="hidden">
            {/* Left column */}
            <Box
                flex="1 1 50%"
                sx={{
                    background: "linear-gradient(to top, #00C9FF 0%, #92FE9D 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "flex-start",
                    px: 8,
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: "normal", lineHeight: 1.2, mt: 10 }}>
                    Welcome to
                </Typography>
                <Box
                    component="img"
                    src="/newlogotransparent.png"
                    alt="Studi logo"
                    sx={{ width: 300, height: "auto", marginLeft: -2.5 }}
                />
                <Typography variant="h5" sx={{ lineHeight: 1.3, mt: 3 }}>
                    Meet people who have similar study needs, boosting productivity, while forming new connections.
                </Typography>
                <Box
                    component="img"
                    src="/lilstudybuds.png"
                    alt="graphic of two dogs studying"
                    sx={{ width: 450, height: "auto", mt: 5, mb: -40 }}
                />
            </Box>

            {/* Right column */}
            <Box
                flex="1 1 50%"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 8,
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: "normal", mb: 4, textAlign: "center" }}>
                    Log In
                </Typography>

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: "80%", mb: 2 }}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ width: "80%", mb: 3 }}
                />

                <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                        width: "80%",
                        height: 50,
                        backgroundColor: "#8ee5f4",
                        color: "#000",
                        fontWeight: "bold",
                        mb: 2,
                        "&:hover": { backgroundColor: "#6fd2e0" },
                    }}
                >
                    Log In
                </Button>

                <Typography sx={{ mt: 3, textAlign: "center", mb: 2 }}>
                    Don't have an account?
                </Typography>

                <Button
                    variant="contained"
                    fullWidth={false}
                    sx={{
                        width: "80%",
                        height: 50,
                        fontWeight: "bold",
                        color: "#000",
                        background: "linear-gradient(to right, #58ed87, #57e9ec)",
                        "&:hover": {
                            background: "linear-gradient(to right, #4ddb75, #49d8e0)",
                        },
                    }}
                    onClick={handleCreateAccountClick}
                >
                    Create An Account
                </Button>
            </Box>
        </Box>
    );
}
