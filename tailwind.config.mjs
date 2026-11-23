/** @type {import('tailwindcss').Config} */
export default {
  "content": [
    "./src/**/*.{astro,js,ts}"
  ],
  "darkMode": "class",
  "theme": {
    "extend": {
      "colors": {
        "inverse-on-surface": "#f4f0e6",
        "surface-container": "#f2eee4",
        "secondary": "#4d635e",
        "surface-dim": "#dddad0",
        "on-background": "#1c1c16",
        "on-surface-variant": "#404847",
        "secondary-container": "#d0e8e2",
        "primary": "#003633",
        "on-secondary-fixed": "#091f1c",
        "surface-variant": "#e6e2d8",
        "surface-tint": "#306763",
        "surface-container-high": "#ece8de",
        "surface-container-low": "#f7f3e9",
        "on-surface": "#1c1c16",
        "inverse-surface": "#31312a",
        "error": "#ba1a1a",
        "on-error-container": "#93000a",
        "on-primary-fixed-variant": "#134f4b",
        "tertiary-fixed-dim": "#ffb59f",
        "on-secondary-fixed-variant": "#364b47",
        "on-error": "#ffffff",
        "inverse-primary": "#99d1cb",
        "on-tertiary-fixed-variant": "#7a2f17",
        "error-container": "#ffdad6",
        "tertiary": "#5b1803",
        "on-secondary-container": "#536964",
        "surface-container-lowest": "#ffffff",
        "outline": "#707977",
        "tertiary-container": "#792e16",
        "on-tertiary-container": "#ff997a",
        "primary-fixed": "#b5ede7",
        "on-primary": "#ffffff",
        "surface-bright": "#fdf9ef",
        "secondary-fixed-dim": "#b4cbc6",
        "primary-fixed-dim": "#99d1cb",
        "on-tertiary-fixed": "#3a0a00",
        "surface": "#fdf9ef",
        "secondary-fixed": "#d0e8e2",
        "background": "#fdf9ef",
        "on-primary-container": "#86beb8",
        "outline-variant": "#bfc8c6",
        "on-secondary": "#ffffff",
        "tertiary-fixed": "#ffdbd1",
        "surface-container-highest": "#e6e2d8",
        "on-tertiary": "#ffffff",
        "primary-container": "#114e4a",
        "on-primary-fixed": "#00201e"
      },
      "borderRadius": {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      "spacing": {
        "gutter-mobile": "1rem",
        "space-sm": "0.75rem",
        "space-lg": "2rem",
        "space-md": "1.25rem",
        "gutter": "1.5rem",
        "space-xs": "0.375rem",
        "margin": "3rem",
        "margin-mobile": "1.25rem",
        "space-xl": "3.5rem"
      },
      "fontFamily": {
        "label-md": [
          "\"Source Sans 3\""
        ],
        "label-sm": [
          "\"Source Sans 3\""
        ],
        "display-lg": [
          "\"Plus Jakarta Sans\""
        ],
        "headline-lg-mobile": [
          "\"Plus Jakarta Sans\""
        ],
        "label-lg": [
          "\"Source Sans 3\""
        ],
        "body-lg": [
          "\"Source Sans 3\""
        ],
        "headline-md": [
          "\"Plus Jakarta Sans\""
        ],
        "body-sm": [
          "\"Source Sans 3\""
        ],
        "headline-lg": [
          "\"Plus Jakarta Sans\""
        ],
        "body-md": [
          "\"Source Sans 3\""
        ],
        "headline-sm": [
          "\"Plus Jakarta Sans\""
        ],
        "display-lg-mobile": [
          "\"Plus Jakarta Sans\""
        ]
      },
      "fontSize": {
        "label-lg": [
          "15px",
          {
            "lineHeight": "20px",
            "letterSpacing": "0.02em",
            "fontWeight": "600"
          }
        ],
        "headline-md": [
          "28px",
          {
            "lineHeight": "36px",
            "fontWeight": "500"
          }
        ],
        "label-md": [
          "13px",
          {
            "lineHeight": "18px",
            "letterSpacing": "0.04em",
            "fontWeight": "600"
          }
        ],
        "display-lg": [
          "56px",
          {
            "lineHeight": "64px",
            "letterSpacing": "-0.02em",
            "fontWeight": "400"
          }
        ],
        "headline-lg": [
          "40px",
          {
            "lineHeight": "48px",
            "letterSpacing": "-0.015em",
            "fontWeight": "400"
          }
        ],
        "display-lg-mobile": [
          "36px",
          {
            "lineHeight": "44px",
            "letterSpacing": "-0.01em",
            "fontWeight": "400"
          }
        ],
        "headline-sm": [
          "22px",
          {
            "lineHeight": "30px",
            "fontWeight": "600"
          }
        ],
        "headline-lg-mobile": [
          "28px",
          {
            "lineHeight": "36px",
            "fontWeight": "400"
          }
        ],
        "body-md": [
          "16px",
          {
            "lineHeight": "26px",
            "fontWeight": "400"
          }
        ],
        "body-lg": [
          "19px",
          {
            "lineHeight": "30px",
            "fontWeight": "400"
          }
        ],
        "body-sm": [
          "14px",
          {
            "lineHeight": "22px",
            "fontWeight": "400"
          }
        ],
        "label-sm": [
          "11px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.06em",
            "fontWeight": "700"
          }
        ]
      }
    }
  }
};
