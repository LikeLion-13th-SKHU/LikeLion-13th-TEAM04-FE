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
  // LoginCard에서 사용하는 색상들
  cardBorder: "#E5E7EB",
  textPrimary: "#111827",
  btnBorder: "#D1D5DB",
  btnHover: "#F9FAFB",
  focus: "#3B82F6",
} as const;

export const size = {
  cardW: "400px",
} as const;

export const radius = {
  card: "12px",
  button: "8px",
} as const;

export const shadow = {
  card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
} as const;

export const theme = {
  colors,
  size,
  radius,
  shadow,
};

export type AppTheme = typeof theme;

