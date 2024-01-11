import { createContext } from "react";
import { useReducer } from "react";

export const UpdateFileContext = createContext();

export function fileReducer(state, action) {
    switch (action.type) {
        case "UPLOAD":
            return { file: action.payload };
        case "DELETE":
            return { file: action.payload };
        case "CLEAR":
            return { file: null };
        default:
            return state;
    }
}

export function UpdateFileContextProvider({ children }) {
    const [state, dispatch] = useReducer(fileReducer, { file: null });

    console.log("UpdateFileContext state:", state);

    return (
        <UpdateFileContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UpdateFileContext.Provider>
    );
}