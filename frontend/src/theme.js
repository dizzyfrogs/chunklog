import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: mode === 'dark' ? '#0f172a' : '#f1f5f9',
      paper: mode === 'dark' ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
      secondary: mode === 'dark' ? '#cbd5e1' : '#64748b',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          '&:hover': {
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #5568d3 0%, #6a3c91 100%)'
              : 'linear-gradient(135deg, #5568d3 0%, #6a3c91 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: mode === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #1f2542 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: mode === 'dark' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 4px 16px rgba(99, 102, 241, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'dark'
              ? '0 12px 40px rgba(0, 0, 0, 0.5)'
              : '0 8px 24px rgba(99, 102, 241, 0.15)',
            border: mode === 'dark' 
              ? '1px solid rgba(99, 102, 241, 0.3)' 
              : '1px solid rgba(99, 102, 241, 0.2)',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a3c91 100%)',
            boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
          },
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          background: mode === 'dark' ? '#1e293b' : '#f8fafc',
          border: `1px solid ${mode === 'dark' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
          '&:hover': {
            background: mode === 'dark' ? '#334155' : '#e2e8f0',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: mode === 'dark' ? '#0f172a' : '#ffffff',
          borderTop: `1px solid ${mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#6366f1',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input': {
            textAlign: 'left',
            padding: '16.5px 30px !important',
          },
          '& textarea': {
            textAlign: 'left',
            padding: '16.5px 30px',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '& input': {
            textAlign: 'left !important',
            padding: '16.5px 30px !important',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          padding: '16.5px 52px 16.5px 30px',
          textAlign: 'left',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          padding: '0 !important',
          '& input': {
            padding: '16.5px 30px !important',
          },
        },
        input: {
          padding: '16.5px 30px !important',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

