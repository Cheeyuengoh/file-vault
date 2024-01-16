import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from './hooks/useAuthContext';
import IndexPage from './pages/IndexPage';
import MyVaultPage from "./pages/MyVaultPage";
import FoldersPage from './pages/FoldersPage';
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import ShareVaultPage from './pages/ShareVaultPage';


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
          dispatch({ type: "LOGIN", payload: json.data });
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
          <Route path="/" element={<IndexPage />}>
            <Route path="my-vault" element={<MyVaultPage />}></Route>
            <Route path="share-vault" element={<ShareVaultPage />}></Route>
            <Route path="folders">
              <Route path=":id" element={<FoldersPage />}></Route>
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
