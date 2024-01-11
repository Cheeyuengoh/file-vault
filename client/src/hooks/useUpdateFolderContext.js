import { useContext } from "react";
import { UpdateFolderContext } from "../contexts/UpdateFolderContext";

export function useUpdateFolderContext() {
    const context = useContext(UpdateFolderContext);

    if (!context) {
        throw Error("useUpdateFolderContext must be used inside an UpdateFolderContextProvider");
    }

    return context;
}