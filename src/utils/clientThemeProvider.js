"use client";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "@/utils/theme";
import Navbar from "@/components/navbar/Navbar";
import { usePathname } from "next/navigation";

export default function ClientThemeProvider({ children }) {
    const pathname = usePathname();
    const hideNav = ["/login", "/signup"].includes(pathname);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {!hideNav && <Navbar />}
            {children}
        </ThemeProvider>
    );
}
