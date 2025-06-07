import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { routes } from './routes/main.route';
import './App.css'

function App() {
  const router = createBrowserRouter(routes);

  return (
    <AuthProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  )
}

export default App
