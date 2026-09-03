import theme from "@/theme";
import { useMediaQuery } from "@mui/material";

export function useIsMobileDevice(): boolean {
    return useMediaQuery(theme.breakpoints.down("md"));
}   
