import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ModalWithOverlay from "./templates/ModalWithOverlay";

export default function CreateFolderModal({ setShowModal, parentFolderID }) {
    const { user } = useAuthContext();
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
                body: JSON.stringify({ folderName, parentFolderID })
            });
            const json = await response.json();
            console.log(json);
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