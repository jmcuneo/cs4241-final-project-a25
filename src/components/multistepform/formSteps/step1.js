// Study preferences blurb/instructions
import { Box, Typography } from "@mui/material";

export default function Step1() {
    return (
        <Box sx={{ textAlign: "center", pl: 8, pr: 8 }}>
            <Typography variant="h5" gutterBottom>
                Study Preferences
            </Typography>
            <Typography variant="h6">
                To find the most fitting study buddy match for you, please
                inform us of your preferences. If you have no preferences for a category, you can skip it.
            </Typography>
        </Box>
    );
}