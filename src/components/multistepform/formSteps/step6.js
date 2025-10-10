// Study Rhythm
import { Box, Grid, Typography } from "@mui/material";
import OptionCard from "./OptionCard";
import {
    Sunny,
    AccessTime,
    NightsStay,
    DirectionsRun,
    TransferWithinAStation,
    DirectionsWalk,
    EmojiFoodBeverage,
    Timelapse,
    TimerOff,
} from "@mui/icons-material";

export default function Step6({ formData, onChange }) {
    // have the option card act like an input field when selected
    const handleSelect = (name, value) => onChange({ target: { name, value } });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mt: 2,
                alignItems: "center",
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Study Rhythm
            </Typography>
            {/* Time of Day */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                What time of the day do you prefer to study?
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={4}>
                    <OptionCard
                        label="Morning"
                        icon={<Sunny fontSize="large" />}
                        value="morning"
                        selected={formData.timeOfDay === "morning"}
                        onSelect={(val) => handleSelect("timeOfDay", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Afternoon"
                        icon={<AccessTime fontSize="large" />}
                        value="afternoon"
                        selected={formData.timeOfDay === "afternoon"}
                        onSelect={(val) => handleSelect("timeOfDay", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Night"
                        icon={<NightsStay fontSize="large" />}
                        value="night"
                        selected={formData.timeOfDay === "night"}
                        onSelect={(val) => handleSelect("timeOfDay", val)}
                    />
                </Grid>
            </Grid>

            {/* Study Pace */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                How fast do you plan to go over content?
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={4}>
                    <OptionCard
                        label="Fast"
                        icon={<DirectionsRun fontSize="large" />}
                        value="fast"
                        selected={formData.studyPace === "fast"}
                        onSelect={(val) => handleSelect("studyPace", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Steady"
                        icon={<TransferWithinAStation fontSize="large" />}
                        value="steady"
                        selected={formData.studyPace === "steady"}
                        onSelect={(val) => handleSelect("studyPace", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Slow"
                        icon={<DirectionsWalk fontSize="large" />}
                        value="slow"
                        selected={formData.studyPace === "slow"}
                        onSelect={(val) => handleSelect("studyPace", val)}
                    />
                </Grid>
            </Grid>

            {/* Break Style */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Do you prefer short, long, or no breaks?
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <OptionCard
                        label="Short and Frequent"
                        icon={<EmojiFoodBeverage fontSize="large" />}
                        value="short"
                        selected={formData.breakStyle === "short"}
                        onSelect={(val) => handleSelect("breakStyle", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Long and Few"
                        icon={<Timelapse fontSize="large" />}
                        value="long"
                        selected={formData.breakStyle === "long"}
                        onSelect={(val) => handleSelect("breakStyle", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="No Breaks"
                        icon={<TimerOff fontSize="large" />}
                        value="none"
                        selected={formData.breakStyle === "none"}
                        onSelect={(val) => handleSelect("breakStyle", val)}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}