import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function LoginPage() {
    const { dispatch } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5050/user/loginUser", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: "LOGIN", payload: json.data });
                navigate("/my-vault");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="form-section">
            <form className="loginForm" onSubmit={handleSubmit}>
                <label>
                    <p>Email:</p>
                    <input className="loginInput" type="text" onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <label>
                    <p>Password:</p>
                    <input className="loginInput" type="password" onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <button className="loginButton" type="submit">Login</button>
            </form>
        </section>
    );
}