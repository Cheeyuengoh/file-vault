import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function RegisterPage() {
    const { dispatch } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5050/user/registerUser", {
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
            <form className="registerForm" onSubmit={handleSubmit}>
                <label>
                    <p>Email:</p>
                    <input className="registerInput" type="text" onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <label>
                    <p>Password:</p>
                    <input className="registerInput" type="password" onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <button className="registerButton" type="submit">Register</button>
            </form>
        </section>
    );
}