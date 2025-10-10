import { createTheme } from "@mui/material/styles";
import { stepConnectorClasses } from "@mui/material/StepConnector";

const theme = createTheme({
    typography: {
        fontFamily: "Lexend, Arial, sans-serif",
    },
    palette: {
        background: {
            default: "white",
            paper: "white", // option card background
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "5px",
                    textTransform: "none",
                    color: "black",
                    fontSize: "1rem",
                    padding: "10px 22px",
                },
                containedPrimary: {
                    backgroundColor: "#89e0f0",
                },
                containedSuccess: {
                    backgroundColor: "#7bd195",
                },
                outlinedSecondary: {
                    backgroundColor: "white",
                    borderColor: "white",
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",

                    "&:hover": {
                        backgroundColor: "white",
                        borderColor: "white",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)",
                    },
                },
                containedError: {
                    backgroundColor: "#ffb5ad",
                },
            },
        },
        MuiStepLabel: {
            styleOverrides: {
                root: {
                    "& .MuiStepLabel-label.Mui-active": {
                        color: "#002d45",
                        fontWeight: "bold",
                    },
                    "& .MuiStepLabel-label.Mui-completed": {
                        color: "#12331a",
                    },
                },
            },
        },
        MuiStepConnector: {
            styleOverrides: {
                root: {
                    [`& .${stepConnectorClasses.line}`]: {
                        borderColor: "lightgray",
                        borderTopWidth: 2,
                    },
                    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]:
                        {
                            borderColor: "#2fbbd4",
                        },
                    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]:
                        {
                            borderColor: "#5DC578",
                        },
                },
            },
        },
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    color: "lightgray",
                    "&.Mui-active": {
                        color: "#2fbbd4",
                    },
                    "&.Mui-completed": {
                        color: "#5DC578",
                    },
                },
            },
        },
    },
});

export default theme;
