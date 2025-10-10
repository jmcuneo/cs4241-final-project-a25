"use client";

import {
    Card,
    CardContent,
    Typography,
    Grid,
    Stack,
    Chip,
    Box,
} from "@mui/material";
import { useState } from "react";


const formatLabel = (value) => {
    if (!value) return "";

    const labelMap = {
        introverted: "Introverted",
        extroverted: "Extroverted",

        highest_priority: "Highest Grades",
        just_pass: "Just Pass",

        exam: "Exam",
        project: "Project",
        hw: "Homework",

        yap: "Yap",
        lock_in: "Lock In",

        silent: "Silent",
        bgm: "Background Music",
        chatter: "Chatter",

        morning: "Morning",
        afternoon: "Afternoon",
        night: "Night",

        fast: "Fast",
        steady: "Steady",
        slow: "Slow + Detailed",

        short: "Short + Frequent",
        long: "Long + Few",
        none: "None",
    };

    return labelMap[value] || value;
};

export default function MatchCard({ match, targetForm }) {
    const { user, form, distance } = match;
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    const getChipColor = (fieldName, value) => {
        if (!targetForm) return "default";
        return targetForm[fieldName] === value ? "success" : "error";
    };

    return (
        <Box
            sx={{
                perspective: "1000px",
                maxWidth: 400,
                width: "100%",
                height: 400,
            }}
        >
            <Box
                onClick={handleClick}
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.6s",
                    transformStyle: "preserve-3d",
                    cursor: "pointer",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Front of card */}
                <Card
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        borderRadius: 3,
                        boxShadow: 3,
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                            boxShadow: 6,
                        },
                    }}
                >
                    <CardContent
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textAlign: "center",
                            py: 3,
                        }}
                    >
                        <Box /> {/* Spacer for top */}
                        <Box>
                            <Typography
                                variant="h5"
                                gutterBottom
                                fontWeight="bold"
                            >
                                {user.name}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                gutterBottom
                            >
                                Major: {user.major}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                gutterBottom
                            >
                                Class of {user.gradYear}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Language: {user.preferredLanguage}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                {user.email}
                            </Typography>

                            {form.course && (
                                <Box sx={{ mt: 3 }}>
                                    <Chip
                                        label={form.course}
                                        color="primary"
                                        size="medium"
                                    />
                                </Box>
                            )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            Click to see study preferences
                        </Typography>
                    </CardContent>
                </Card>

                {/* Back of card */}
                <Card
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: 3,
                        boxShadow: 3,
                        overflow: "auto",
                        "&:hover": {
                            boxShadow: 6,
                        },
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            gutterBottom
                            align="center"
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                        >
                            Study Preferences
                        </Typography>

                        <Grid container spacing={2}>
                            {/* Personality */}
                            {form.personality && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        gutterBottom
                                    >
                                        Personality
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        sx={{ flexWrap: "wrap", gap: 1 }}
                                    >
                                        <Chip
                                            label={formatLabel(
                                                form.personality
                                            )}
                                            color={getChipColor(
                                                "personality",
                                                form.personality
                                            )}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Stack>
                                </Grid>
                            )}

                            {/* Study Goals */}
                            {(form.priority || form.assignment) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        gutterBottom
                                    >
                                        Study Goals
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        sx={{ flexWrap: "wrap", gap: 1 }}
                                    >
                                        {form.priority && (
                                            <Chip
                                                label={`Priority: ${formatLabel(
                                                    form.priority
                                                )}`}
                                                color={getChipColor(
                                                    "priority",
                                                    form.priority
                                                )}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        {form.assignment && (
                                            <Chip
                                                label={`Assignment: ${formatLabel(
                                                    form.assignment
                                                )}`}
                                                color={getChipColor(
                                                    "assignment",
                                                    form.assignment
                                                )}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    </Stack>
                                </Grid>
                            )}

                            {/* Study Environment */}
                            {(form.communicationStyle ||
                                form.noiseLevel ||
                                form.isOnline != null) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        gutterBottom
                                    >
                                        Study Environment
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        sx={{ flexWrap: "wrap", gap: 1 }}
                                    >
                                        {form.communicationStyle && (
                                            <Chip
                                                label={`Style: ${formatLabel(
                                                    form.communicationStyle
                                                )}`}
                                                color={getChipColor(
                                                    "communicationStyle",
                                                    form.communicationStyle
                                                )}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        {form.noiseLevel && (
                                            <Chip
                                                label={`Noise: ${formatLabel(
                                                    form.noiseLevel
                                                )}`}
                                                color={getChipColor(
                                                    "noiseLevel",
                                                    form.noiseLevel
                                                )}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        {form.isOnline != null && (
                                            <Chip
                                                label={
                                                    form.isOnline
                                                        ? "Online"
                                                        : "In-Person"
                                                }
                                                color={getChipColor(
                                                    "isOnline",
                                                    form.isOnline
                                                )}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    </Stack>
                                </Grid>
                            )}

                            {/* Study Rhythm */}
                            {(form.timeOfDay ||
                                form.studyPace ||
                                form.breakStyle) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        gutterBottom
                                    >
                                        Study Rhythm
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        sx={{ flexWrap: "wrap", gap: 1 }}
                                    >
                                        {form.timeOfDay && (
                                            <Chip
                                                label={`Time: ${formatLabel(
                                                    form.timeOfDay
                                                )}`}
                                                color={getChipColor(
                                                    "timeOfDay",
                                                    form.timeOfDay
                                                )}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        {form.studyPace && (
                                            <Chip
                                                label={`Pace: ${formatLabel(
                                                    form.studyPace
                                                )}`}
                                                color={getChipColor(
                                                    "studyPace",
                                                    form.studyPace
                                                )}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        {form.breakStyle && (
                                            <Chip
                                                label={`Break: ${formatLabel(
                                                    form.breakStyle
                                                )}`}
                                                color={getChipColor(
                                                    "breakStyle",
                                                    form.breakStyle
                                                )}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    </Stack>
                                </Grid>
                            )}
                        </Grid>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            align="center"
                            display="block"
                            sx={{ mt: 2 }}
                        >
                            Click to see student info
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}