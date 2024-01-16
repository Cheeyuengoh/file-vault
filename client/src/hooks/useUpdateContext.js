import { useContext } from "react";
import { UpdateContext } from "../contexts/UpdateContext";

export function useUpdateContext() {
    const context = useContext(UpdateContext);

    if (!context) {
        throw Error("useUpdateContext must be used inside an UpdateContextProvider");
    }

    return context;
}