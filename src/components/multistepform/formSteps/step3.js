// Personality
import { Box, Grid, Typography } from "@mui/material";
import OptionCard from "./OptionCard";
import { Person, Groups } from "@mui/icons-material";

export default function Step3({ formData, onChange }) {
    // have the option card act like an input field when selected
    const handleSelect = (value) =>
        onChange({ target: { name: "personality", value } });

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
                Personality
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Do you have any personality preferences?
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <OptionCard
                        label="Introverted"
                        icon={<Person fontSize="large" />}
                        value="introverted"
                        selected={formData.personality === "introverted"}
                        onSelect={handleSelect}
                    />
                </Grid>
                <Grid item xs={6}>
                    <OptionCard
                        label="Extroverted"
                        icon={<Groups fontSize="large" />}
                        value="extroverted"
                        selected={formData.personality === "extroverted"}
                        onSelect={handleSelect}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}