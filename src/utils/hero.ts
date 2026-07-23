import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        //@ts-expect-error this is a custom color name
        "secondary-background": "#F4F4F5",
      },
    },
    dark: {
      colors: {
        background: "#0D0C0F",
        //@ts-expect-error this is a custom color name
        "secondary-background": "#18181B",
      },
    },
  },
});
