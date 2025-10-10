// Course selection
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";

export default function Step2({ formData, onChange }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                overflow: "visible",
            }}
        >
            <FormControl sx={{ width: "75%" }}>
                <InputLabel>What course are you studying for?</InputLabel>
                <Select
                    name="course"
                    value={formData.course || ""}
                    onChange={onChange}
                    label="What course are you studying for?"
                    sx={{ backgroundColor: "white" }}
                >
                    <MenuItem value="">-- Select a course --</MenuItem>
                    <MenuItem value="cs1101">CS 1101</MenuItem>
                    <MenuItem value="cs2102">CS 2102</MenuItem>
                    <MenuItem value="cs3733">CS 3733</MenuItem>
                </Select>
                {!formData.course && (
                    <Typography
                        variant="subtitle2"
                        color="error"
                        sx={{ mt: 0.5 }}
                    >
                        Course selection is required
                    </Typography>
                )}
            </FormControl>
        </Box>
    );
}
