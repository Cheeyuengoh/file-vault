import { createContext } from "react";
import { useReducer } from "react";

export const UpdateFolderContext = createContext();

export function folderReducer(state, action) {
    switch (action.type) {
        case "CREATE":
            return { folder: action.payload };
        case "DELETE":
            return { folder: action.payload };
        case "CLEAR":
            return { folder: null };
        default:
            return state;
    }
}

export function UpdateFolderContextProvider({ children }) {
    const [state, dispatch] = useReducer(folderReducer, { folder: null });

    console.log("UpdateFolderContext state:", state);

    return (
        <UpdateFolderContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UpdateFolderContext.Provider>
    );
}