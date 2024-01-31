import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateContext } from "../hooks/useUpdateContext";
import ModalWithOverlay from "./templates/ModalWithOverlay";

export default function CreateFolderModal({ setShowModal, folderID }) {
    const { user } = useAuthContext();
    const { dispatch } = useUpdateContext();
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
                body: JSON.stringify({ folderName, folderID, action: "create" })
            });
            const json = await response.json();
            dispatch({ type: "FOLDER_CREATE", payload: json.data });
            setShowModal(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <ModalWithOverlay setShowModal={setShowModal}>
            <form className="folderForm" onSubmit={handleSubmit}>
                <label>
                    <p>Folder Name</p>
                    <input className="folderInput" type="text" onChange={(e) => setFolderName(e.target.value)}></input>
                </label>
                <button className="folderButton" type="submit">Create</button>
            </form>
        </ModalWithOverlay>
    );
}