"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/utils/theme";
import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    Divider,
    Paper,
    Grid,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MatchCard from "@/components/matchCard/matchCard";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [openCourse, setOpenCourse] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [userForms, setUserForms] = useState({});
    const [userData, setUserData] = useState(null);
    const [currentMatches, setCurrentMatches] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${session.user.email}`);
                const data = await res.json();

                if (!data._id) {
                    setError("User data not found");
                    return;
                }

                setUserData(data);
                localStorage.setItem("userId", data._id);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };
        fetchUser();
    }, [session]);

    useEffect(() => {
        if (!userData?._id) return;

        const fetchForms = async () => {
            try {
                // Fetch forms for this user
                const formsResponse = await fetch(
                    `/api/form?userId=${userData._id}`
                );
                const formsData = await formsResponse.json();

                if (formsData.success) {
                    setUserForms(formsData.forms);
                } else {
                    console.error("Failed to load forms");
                }
            } catch (err) {
                console.error("Error fetching forms:", err);
            }
        };
        fetchForms();
    }, [userData]);

    // Fetch matches when a form is selected
    const handleFormClick = async (form) => {
        setSelectedForm(form);
        setCurrentMatches([]);

        try {
            const response = await fetch(`/api/matches?targetForm=${form._id}`);
            const data = await response.json();

            if (data.success && data.matchBatch?.bestMatches) {
                setCurrentMatches(data.matchBatch.bestMatches);
                console.log("currentMatches: ", currentMatches);
            }
        } catch (err) {
            console.error("Error fetching matches:", err);
        }
    };

    const handleCourseClick = (course) =>
        setOpenCourse(openCourse === course ? null : course);

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    width: "100vw",
                    height: "calc(100vh - 64px)",
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                    backgroundColor: "#f5f7fa",
                }}
            >
                {/* Sidebar */}
                <Box
                    sx={{
                        flex: "0 0 35%",
                        backgroundColor: "#ffffff",
                        borderRight: `1px solid ${theme.palette.divider || "#ddd"
                            }`,
                        p: 3,
                        overflowY: "auto",
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 700, color: "#002d45", mb: 3 }}
                    >
                        My Match Runs
                    </Typography>
                    <Divider sx={{ mb: 4 }} />

                    <List component="nav">
                        {Object.entries(userForms).map(([course, forms]) => (
                            <Box key={course} sx={{ mb: 2 }}>
                                <ListItemButton
                                    onClick={() => handleCourseClick(course)}
                                    sx={{
                                        borderRadius: 2,
                                        p: 2,
                                        boxShadow:
                                            openCourse === course
                                                ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                                                : "0 1px 3px rgba(0,0,0,0.05)",
                                        backgroundColor:
                                            openCourse === course
                                                ? "#e3f2fd"
                                                : "#fafafa",
                                        "&:hover": {
                                            backgroundColor: "#d8f3dc",
                                            transform: "translateY(-1px)",
                                        },
                                        transition: "all 0.25s ease",
                                    }}
                                >
                                    <ListItemText
                                        primary={course}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                        }}
                                    />
                                    {openCourse === course ? (
                                        <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                    )}
                                </ListItemButton>

                                <Collapse
                                    in={openCourse === course}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        {forms.map((form) => (
                                            <ListItemButton
                                                key={form._id}
                                                sx={{
                                                    pl: 5,
                                                    my: 1,
                                                    borderRadius: 2,
                                                    backgroundColor:
                                                        selectedForm?._id ===
                                                            form._id
                                                            ? "#bbf0d7"
                                                            : "#f9f9f9",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#c9f2df",
                                                        transform:
                                                            "translateX(2px)",
                                                    },
                                                    transition: "all 0.2s ease",
                                                }}
                                                selected={
                                                    selectedForm?._id ===
                                                    form._id
                                                }
                                                onClick={() =>
                                                    handleFormClick(form)
                                                }
                                            >
                                                <ListItemText
                                                    primary={`Form ${form._id}`}
                                                    primaryTypographyProps={{
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>
                        ))}
                    </List>
                </Box>

                {/* Content */}
                <Box
                    sx={{
                        flex: "1 1 65%",
                        p: 5,
                        overflowY: "auto",
                    }}
                >
                    {!selectedForm ? (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 6,
                                textAlign: "center",
                                color: "#555",
                                border: "1px dashed #ccc",
                                borderRadius: 3,
                                backgroundColor: "#fefefe",
                            }}
                        >
                            <Typography variant="h6">
                                To get started, fill out the "Find a Study
                                Buddy" preference form.
                            </Typography>
                            <Typography variant="h6">
                                Then, select a course
                                and one of your forms to see matches.
                            </Typography>
                        </Paper>
                    ) : (
                        <Box>
                            {/* Fun, personalized header */}
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    color: "#002d45",
                                    mb: 1,
                                }}
                            >
                                Study Buddy Matches
                            </Typography>

                            {currentMatches.length === 0 ? (
                                <Typography color="text.secondary">
                                    No matches found
                                </Typography>
                            ) : (
                                <Box display="flex" flexWrap="wrap" gap={2}>
                                    {currentMatches.map((match) => (
                                        <MatchCard
                                            key={match.form._id}
                                            match={match}
                                            targetForm={selectedForm}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
