import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import Landing from './pages/dashboard/Landing';
import Login from './pages/login/Login';
import ProtectedRoute from './components/ProtectedRoutes';
import ShipDetails from './pages/dashboard/detailPage';

export const routes = [
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Navigate to="/login" replace />
			  },
			{
				path: '/dashboard',
				element: (
				  <ProtectedRoute>
					<Landing />
				  </ProtectedRoute>
				),
			  },
			  {
				path: '/dashboard/ships/:shipId',
				element: (
				  <ProtectedRoute>
					<ShipDetails />
				  </ProtectedRoute>
				),
			  },
			{
				path: "/login",
				element: <Login />
			}
		]
	}
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			cacheTime: 1000 * 60 * 15
		}
	}
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>
);
