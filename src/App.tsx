import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes/main.route';
import './App.css'

function App() {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
