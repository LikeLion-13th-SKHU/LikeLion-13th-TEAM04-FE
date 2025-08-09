import "styled-components";
import type { AppTheme } from "../styles/theme";

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}
