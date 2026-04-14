import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used inside ThemeProviderWrapper");
    }
    return context;
};

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>("light");

    useEffect(() => {
        const saved = localStorage.getItem("theme") as ThemeMode | null;
        if (saved) setMode(saved);
    }, []);

    const toggleTheme = () => {
        setMode((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", next);
            return next;
        });
    };

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode,
                background: {
                    default: mode === "light" ? "#FFF" : "#323232",
                    paper: mode === "light" ? "#ebebeb" : "#2C2C2C",
                },
                text: {
                    primary: mode === "light" ? "#333333" : "#E0E0E0",
                    secondary: mode === "light" ? "#4D5053" : "#B0B0B0",
                },
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        ":root": {
                            "--bg-default": mode === "light" ? "#FFF" : "#323232",
                            "--bg-paper": mode === "light" ? "#FFF" : "#2C2C2C",
                            "--bg-surface": mode === "light" ? "#F4F0EC" : "#2C2C2C",

                            "--text-primary": mode === "light" ? "#292F36" : "#E0E0E0",
                            "--text-secondary": mode === "light" ? "#4D5053" : "#B0B0B0",

                            "--bg-hover": mode === "light" ? "#F4F0EC" : "#3a3a3a",
                        },
                        header: {
                            backgroundColor: mode === "light" ? "#FFF" : "#000",
                        },
                        footer: {
                            backgroundColor: mode === "light" ? "#FFF" : "#000",
                        },
                        button: {
                            backgroundColor: mode === "light" ? "#292F36" : "#000",
                        }
                    },
                },
            },
        }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};