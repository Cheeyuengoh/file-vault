import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateFolderContext } from "../hooks/useUpdateFolderContext";
import ModalWithOverlay from "./templates/ModalWithOverlay";

export default function CreateFolderModal({ setShowModal, folderID }) {
    const { user } = useAuthContext();
    const { dispatch } = useUpdateFolderContext();
    const [folderName, setFolderName] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5050/folder/createFolder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.accessToken
                },
                body: JSON.stringify({ folderName, folderID })
            });
            const json = await response.json();
            dispatch({ type: "CREATE", payload: json.folder });
            setShowModal(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <ModalWithOverlay setShowModal={setShowModal}>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Folder Name</p>
                    <input type="text" onChange={(e) => setFolderName(e.target.value)}></input>
                </label>
                <button type="submit">Create</button>
            </form>
        </ModalWithOverlay>
    );
}