export const colors = {
  blue: {
    100: "#E6EBF7", // 10%
    300: "#C7D1EB", // 30%
    500: "#9CADD6", // 50%
    700: "#6E80C0", // 70%
    900: "#2142AB", // 100%
  },
  black: "#0E0E0E",
  white: "#FFFFFF",
  gray: {
    100: "#F3F4F6",
    200: "#E5E7EB",
    900: "#111827",
  },
} as const;

export const theme = {
  colors,
};

export type AppTheme = typeof theme;
