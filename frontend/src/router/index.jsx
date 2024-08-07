import { createBrowserRouter } from 'react-router-dom';
import LoginFormModal from '../components/LoginFormModal';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage';
import DashboardPage from '../components/DashboardPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      // we might not need these /login and /signup routes because they're already modals
      {
        path: "/dashboard",
        element: <DashboardPage />
      }

    ],
  },
]);
