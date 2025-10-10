"use client";

import MultiStepForm from "@/components/multistepform/MultiStepForm";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Form() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                my: 4,
                px: 2,
            }}
        >
            <Box
                sx={{
                    width: { xs: "100%", sm: 800 },
                    backgroundColor: "#E8E8E8",
                    borderRadius: "7px",
                    color: "black",
                    p: 4,
                }}
            >
                <MultiStepForm />
            </Box>
        </Box>
    );
}
