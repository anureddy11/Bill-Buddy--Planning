import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import LandingPage from '../components/LandingPage';
import DashboardPage from '../components/DashboardPage';
import AllExpensesPage from '../components/AllExpensesPage';
import RecentActivityPage from '../components/RecentActivityPage';
import CreateExpensePage from '../components/CreateExpensePage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />
      },
      {
        path: "/recent-activity",
        element: <RecentActivityPage />
      },
      {
        path: "/all-expenses",
        element: <AllExpensesPage />
      },
      {
        path: "/create-expense",
        element: <CreateExpensePage />
      }

    ],
  },
]);
