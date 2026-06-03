export const positionStyles: Record<string, string> = {
  "top-left": "justify-left items-start",
  "top-center": "justify-center items-start",
  "top-right": "justify-end items-start",

  "center-left": "justify-left items-center",
  "center": "justify-center items-center",
  "center-right": "justify-end items-center",

  "bottom-left": "justify-left items-end",
  "bottom-center": "justify-center items-end",
  "bottom-right": "justify-end items-end",
};

export const positions = Object.keys(positionStyles);