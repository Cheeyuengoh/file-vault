import { useState } from "react";

export function useSessionStorage(key) {
    if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, JSON.stringify({ vault: "my-vault" }));
    }
    const [state, setState] = useState(JSON.parse(sessionStorage.getItem(key)));
    function setStorage(value) {
        setState(value);
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    return [state, setStorage];
}