import { useContext } from "react";
import { UpdateFileContext } from "../contexts/UpdateFileContext";

export function useUpdateFileContext() {
    const context = useContext(UpdateFileContext);

    if (!context) {
        throw Error("useUpdateFileContext must be used inside an UpdateFileContextProvider");
    }

    return context;
}