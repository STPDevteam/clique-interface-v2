import { createTheme, styled, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

interface Gradient {
  gradient1: string
}

interface Height {
  header: string
  mobileHeader: string
}
interface Width {
  sidebar: string
  maxContent: string
}

interface TextColor {
  text1: string
  text2: string
  text3: string
  text4: string
  text5: string
  primary: string
}

interface BgColor {
  bg1: string
  bg2: string
  bg3: string
  bg4: string
  bg5: string
}

interface BorderRadius {
  default: string
}
interface BoxShadow {
  bs1: string
  bs2: string
}

declare module '@mui/material/styles' {
  interface Theme {
    textColor: TextColor
    bgColor: BgColor
    gradient: Gradient
    height: Height
    width: Width
    borderRadius: BorderRadius
    boxShadow: BoxShadow
  }
}

declare module '@mui/material/styles/createTheme' {
  interface ThemeOptions {
    textColor: TextColor
    bgColor: BgColor
    gradient: Gradient
    height: Height
    width: Width
    borderRadius: BorderRadius
    boxShadow: BoxShadow
  }
  interface Theme {
    textColor: TextColor
    bgColor: BgColor
    gradient: Gradient
    height: Height
    width: Width
    borderRadius: BorderRadius
    boxShadow: BoxShadow
  }
}

export const theme = {
  palette: {
    primary: {
      light: '#3F8CFF',
      main: '#0049C6',
      dark: '#002685',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#FFEBF6',
      main: '#FFA2C0',
      dark: '#FFB7F5',
      contrastText: '#ffffff'
    },
    // error: {
    //   main: '#C60C00',
    //   light: '#5f2120'
    // },
    warning: {
      main: '#FFCE73'
    },
    info: {
      main: '#F0B90B'
    },
    success: {
      main: '#31B047'
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1B1D21',
      secondary: '#808191',
      disabled: '#E4E4E4'
    },
    action: {
      disabledOpacity: 0.8
    },
    grey: {
      A700: '#191919',
      A400: '#252525',
      A200: '#303030',
      A100: '#A1A1A1'
    }
  },
  textColor: {
    text1: '#B2B3BD',
    text2: '#333333',
    text3: '#727272',
    text4: '#999999',
    text5: '#CCCCCC',
    primary: '#31B047'
  },
  bgColor: {
    bg1: '#F7F7F7',
    bg2: '#E4E4E4',
    bg3: '#6C5DD3',
    bg4: '#FBFCFC',
    bg5: '#F0F3F6'
  },
  borderRadius: {
    default: '24px'
  },
  boxShadow: {
    bs1: '',
    bs2: 'rgb(174 174 174 / 20%) 0px 0px 5px'
  },
  gradient: {
    gradient1: '#ffffff linear-gradient(154.62deg, #77C803 9.44%, #28A03E 59.25%);'
  },
  height: {
    header: '112px',
    mobileHeader: '51px'
  },
  width: {
    sidebar: '250px',
    maxContent: '1110px'
  },
  shape: {
    border: '1px solid',
    borderRadius: 16
  },
  spacing: (factor: number) => `${1 * factor}px`
  // gray: {
  //   main: '#333333',
  //   dark: '#262626',
  // },
}

export const override: any = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: theme.palette.background.default,
        fontSize: 16,
        overflow: 'auto!important',
        paddingRight: '0px!important'
      },
      'html, input, textarea, button, body': {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontDisplay: 'fallback'
      },
      '@supports (font-variation-settings: normal)': {
        'html, input, textarea, button, body': {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontDisplay: 'fallback'
        }
      }
    }
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        fontSize: 12,
        lineHeight: '20px',
        fontWeight: 500,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif!important'
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif!important',
        color: theme.palette.primary.contrastText,
        fontWeight: 500,
        borderRadius: `${theme.shape.borderRadius}px`,
        transition: '.3s',
        textTransform: 'none' as const
      },
      contained: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: 'unset',
        '&:hover, :active': {
          boxShadow: 'unset',
          backgroundColor: theme.palette.primary.dark
        },
        '&:disabled': {
          backgroundColor: theme.palette.primary.light,
          color: '#464647'
        }
      },
      containedSecondary: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        boxShadow: 'unset',
        '&:hover, :active': {
          boxShadow: 'unset',
          backgroundColor: theme.palette.secondary.dark
        },
        '&:disabled': {
          backgroundColor: theme.palette.secondary.light,
          color: '#412E6A'
        }
      },
      outlined: {
        borderColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.contrastText,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main
        }
      },
      outlinedPrimary: {
        backgroundColor: 'transparent',
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          borderColor: theme.palette.primary.dark,
          color: theme.palette.primary.dark
        }
      },
      text: {
        backgroundColor: 'transparent',
        color: theme.palette.primary.contrastText,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          color: theme.palette.primary.main
        }
      },
      textPrimary: {
        color: theme.palette.primary.main,
        backgroundColor: 'transparent',
        '&:hover, :active': {
          backgroundColor: 'transparent',
          color: theme.palette.primary.dark
        }
      },
      textSecondary: {
        color: theme.palette.secondary.main,
        backgroundColor: 'transparent',
        '&:hover, :active': {
          backgroundColor: 'transparent',
          color: theme.palette.secondary.dark
        }
      }
    }
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        lineHeight: 1.2,
        fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif!important'
      },
      h1: {
        fontSize: 56,
        lineHeight: '64px',
        fontWeight: 600
      },
      h2: {
        fontSize: 48,
        lineHeight: '72px',
        fontWeight: 600
      },
      h3: {
        fontSize: 40,
        lineHeight: '60px',
        fontWeight: 600
      },
      h4: {
        fontSize: 32,
        lineHeight: '48px',
        letterSpacing: '-1px',
        fontWeight: 600
      },
      h5: {
        fontSize: 24,
        lineHeight: '32px',
        fontWeight: 600
      },
      h6: {
        fontSize: 18,
        lineHeight: '24px',
        fontWeight: 600
      },
      body1: {
        fontSize: 14,
        lineHeight: '24px',
        fontWeight: 500,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif!important'
      },
      body2: {
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '24px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif!important'
      },
      caption: {
        fontSize: 13,
        lineHeight: '18px',
        fontWeight: 600,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif!important'
      }
    }
  }
}

export const HideOnMobile = styled('div', {
  shouldForwardProp: () => true
})<{ breakpoint?: 'sm' | 'md' }>(({ theme, breakpoint }) => ({
  [theme.breakpoints.down(breakpoint ?? 'sm')]: {
    display: 'none'
  }
}))

export const ShowOnMobile = styled('div', {
  shouldForwardProp: () => true
})<{ breakpoint?: 'sm' | 'md' }>(({ theme, breakpoint }) => ({
  display: 'none',
  [theme.breakpoints.down(breakpoint ?? 'sm')]: {
    display: 'block'
  }
}))

export default createTheme({
  typography: {
    fontFamily: [
      'Inter, sans-serif',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  ...theme,
  components: {
    ...override
  }
})

export function ThemeProvider({ children, theme }: any) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
