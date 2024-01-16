import { createContext, useReducer } from "react";

export const UpdateContext = createContext();

export function updateReducer(state, action) {
    switch (action.type) {
        case "FILE_CREATE":
            return { update: { type: "file", action: "create", data: action.payload } }
        case "FILE_DELETE":
            return { update: { type: "file", action: "delete", data: action.payload } }
        case "FOLDER_CREATE":
            return { update: { type: "folder", action: "create", data: action.payload } }
        case "FOLDER_DELETE":
            return { update: { type: "folder", action: "delete", data: action.payload } }
        case "CLEAR":
            return { update: null }
        default:
            return state;

    }
}

export function UpdateContextProvider({ children }) {
    const [state, dispatch] = useReducer(updateReducer, { update: null });

    console.log("UpdateContext state:", state);

    return (
        <UpdateContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UpdateContext.Provider>
    );
}