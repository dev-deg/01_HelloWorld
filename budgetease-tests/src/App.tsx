import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as IncomeIcon,
  Receipt as ExpenseIcon,
  Savings as SavingsIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from './store';
import { loadIncome } from './store/slices/incomeSlice';
import { loadExpenses } from './store/slices/expensesSlice';
import { loadSavings } from './store/slices/savingsSlice';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import Dashboard from './components/Dashboard';
import IncomePage from './components/Income';
import ExpensesPage from './components/Expenses';
import SavingsPage from './components/Savings';

/**
 * Main App Component
 *
 * Demonstrates:
 * - Material-UI theming
 * - Bottom navigation for mobile-first design
 * - Redux store subscription for persistence
 * - Loading initial state from localStorage
 */

// Create Material-UI theme with mobile-first approach
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    // Optimize components for mobile
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState(0);

  // Get entire Redux state for persistence
  const reduxState = useAppSelector((state) => state);

  /**
   * Load data from localStorage on app mount
   */
  useEffect(() => {
    const savedState = loadFromLocalStorage();
    if (savedState) {
      // Load each slice's data
      if (savedState.income?.sources) {
        dispatch(loadIncome(savedState.income.sources));
      }
      if (savedState.expenses?.items) {
        dispatch(loadExpenses(savedState.expenses.items));
      }
      if (savedState.savings?.goals) {
        dispatch(loadSavings(savedState.savings.goals));
      }
    }
  }, [dispatch]);

  /**
   * Save to localStorage whenever Redux state changes
   * This ensures data persistence across page refreshes
   */
  useEffect(() => {
    saveToLocalStorage(reduxState);
  }, [reduxState]);

  // Navigation tabs
  const pages = [
    { label: 'Dashboard', icon: <DashboardIcon />, component: <Dashboard /> },
    { label: 'Income', icon: <IncomeIcon />, component: <IncomePage /> },
    { label: 'Expenses', icon: <ExpenseIcon />, component: <ExpensesPage /> },
    { label: 'Savings', icon: <SavingsIcon />, component: <SavingsPage /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ pb: 7 }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              💰 BudgetEase
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container
          maxWidth="lg"
          sx={{
            minHeight: 'calc(100vh - 120px)',
            py: 0,
          }}
        >
          {pages[currentTab].component}
        </Container>

        {/* Bottom Navigation - Mobile First */}
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
          >
            {pages.map((page, index) => (
              <BottomNavigationAction
                key={index}
                label={page.label}
                icon={page.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
