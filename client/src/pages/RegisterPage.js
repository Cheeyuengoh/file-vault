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
                dispatch({ type: "LOGIN", payload: json.user });
                navigate("/my-vault");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Email:</p>
                    <input type="text" onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <label>
                    <p>Password:</p>
                    <input type="password" onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <button type="submit">Register</button>
            </form>
        </section>
    );
}