// Study Goals
import { Box, Grid, Typography } from "@mui/material";
import OptionCard from "./OptionCard";
import {
    School,
    TagFaces,
    Quiz,
    AccountTree,
    Description,
} from "@mui/icons-material";

export default function Step4({ formData, onChange }) {
    // have the option card act like an input field when selected
    const handleSelect = (name, value) => 
        onChange({ target: { name, value } });

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
                Study Goals
            </Typography>
            {/* Priority */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                How much effort do you want to put into this course?
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                    <OptionCard
                        label="Highest Grades"
                        icon={<School fontSize="large" />}
                        value="highest_grades"
                        selected={formData.priority === "highest_grades"}
                        onSelect={(val) => handleSelect("priority", val)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <OptionCard
                        label="Just Pass"
                        icon={<TagFaces fontSize="large" />}
                        value="just_pass"
                        selected={formData.priority === "just_pass"}
                        onSelect={(val) => handleSelect("priority", val)}
                    />
                </Grid>
            </Grid>

            {/* Assignment Type */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                What assignment do you need to complete for this class?
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <OptionCard
                        label="Exam"
                        icon={<Quiz fontSize="large" />}
                        value="exam"
                        selected={formData.assignment === "exam"}
                        onSelect={(val) => handleSelect("assignment", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Project"
                        icon={<AccountTree fontSize="large" />}
                        value="project"
                        selected={formData.assignment === "project"}
                        onSelect={(val) => handleSelect("assignment", val)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <OptionCard
                        label="Homework"
                        icon={<Description fontSize="large" />}
                        value="hw"
                        selected={formData.assignment === "hw"}
                        onSelect={(val) => handleSelect("assignment", val)}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}