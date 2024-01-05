import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from './hooks/useAuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FoldersPage from './pages/FoldersPage';


function App() {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let abortController = new AbortController();
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5050/refreshTokens", {
          method: "POST",
          credentials: "include"
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: "LOGIN", payload: json.user });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      abortController.abort();
    }
  }, [dispatch]);

  if (isLoading) return (<div>LOADING...</div>);
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/folders">
            <Route path=":folderID" element={<FoldersPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
