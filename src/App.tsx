import './App.css';
import Router from './routes/Router';
import { useRoutes } from 'react-router-dom';

function App() {
  const routing = useRoutes(Router);

  return (
    <>
      {routing}
    </>
  );
}

export default App;
