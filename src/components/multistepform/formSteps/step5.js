// Study Environment
import { Box, Grid, Typography } from "@mui/material";
import OptionCard from "./OptionCard";
import {
    Forum,
    LockClock,
    VolumeOff,
    VolumeDown,
    VolumeUp,
    Computer,
    LocationCity,
} from "@mui/icons-material";


export default function Step5({ formData, onChange }) {
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
                Study Environment
            </Typography>
            {/* Communication Style */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Do you prefer to yap or lock in?
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                    <OptionCard
                        label="Yap"
                        icon={<Forum fontSize="large" />}
                        value="yap"
                        selected={formData.communicationStyle === "yap"}
                        onSelect={(val) =>
                            handleSelect("communicationStyle", val)
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <OptionCard
                        label="Lock In"
                        icon={<LockClock fontSize="large" />}
                        value="lock_in"
                        selected={formData.communicationStyle === "lock_in"}
                        onSelect={(val) =>
                            handleSelect("communicationStyle", val)
                        }
                    />
                </Grid>
            </Grid>

            {/* Noise Level */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                How quiet or loud do you prefer your study environment to be?
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={4}>
                    <OptionCard
                        label="Silent"
                        icon={<VolumeOff fontSize="large" />}
                        value="silent"
                        selected={formData.noiseLevel === "silent"}
                        onSelect={(val) => handleSelect("noiseLevel", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Background Music"
                        icon={<VolumeDown fontSize="large" />}
                        value="bgm"
                        selected={formData.noiseLevel === "bgm"}
                        onSelect={(val) => handleSelect("noiseLevel", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Chatter"
                        icon={<VolumeUp fontSize="large" />}
                        value="chatter"
                        selected={formData.noiseLevel === "chatter"}
                        onSelect={(val) => handleSelect("noiseLevel", val)}
                    />
                </Grid>
            </Grid>

            {/* Location */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Do you prefer to meet online or in person?
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <OptionCard
                        label="Online"
                        icon={<Computer fontSize="large" />}
                        value={true}
                        selected={formData.isOnline === true}
                        onSelect={(val) => handleSelect("isOnline", val)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <OptionCard
                        label="In-person"
                        icon={<LocationCity fontSize="large" />}
                        value={false}
                        selected={formData.isOnline === false}
                        onSelect={(val) => handleSelect("isOnline", val)}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}