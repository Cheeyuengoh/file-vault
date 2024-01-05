import { useState } from "react";
import ModalWithOverlay from "./templates/ModalWithOverlay";

export default function CreateFolderModal({ setShowModal }) {
    const [folderName, setFolderName] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(folderName);
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