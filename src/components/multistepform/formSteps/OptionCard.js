import { Card, CardActionArea, Typography } from "@mui/material";

export default function OptionCard({ label, icon, value, selected, onSelect }) {
    return (
        <Card
            sx={{
                display: "flex",
                border: selected ? "2px solid #2fbbd4" : "1px solid #ccc",
                borderRadius: 2,
                textAlign: "center",
                justifyContent: "center",
                width: 150,
                height: 150,
            }}
        >
            <CardActionArea onClick={() => onSelect(value)} sx={{ p: 2 }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                    {icon}
                </div>
                <Typography variant="subtitle1">{label}</Typography>
            </CardActionArea>
        </Card>
    );
}
