import { useState } from "react";
import ModalWithOverlay from "./templates/ModalWithOverlay";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateContext } from "../hooks/useUpdateContext";

export default function RenameModal({ setShowModal, setShowDropdown, data }) {
    const { user } = useAuthContext();
    const { dispatch } = useUpdateContext();
    const [rename, setRename] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (data.type === "folder") {
            try {
                const response = await fetch("http://localhost:5050/folder/updateFolderName", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + user.accessToken
                    },
                    body: JSON.stringify({ folderID: data.folderID, rename, action: "update" })
                });
                const json = await response.json();
                dispatch({ type: "FOLDER_UPDATE", payload: json.data });
                setShowModal(false);
            } catch (err) {
                console.log(err);
            }
        }

        if (data.type === "file") {
            try {
                const response = await fetch("http://localhost:5050/file/updateFilename", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + user.accessToken
                    },
                    body: JSON.stringify({ fileID: data.fileID, rename, action: "update" })
                });
                const json = await response.json();
                dispatch({ type: "FILE_UPDATE", payload: json.data });
                setShowModal(false);
                setShowDropdown(false);
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <ModalWithOverlay setShowModal={setShowModal}>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Rename {data.type}</p>
                    <input type="text" onChange={(e) => setRename(e.target.value)}></input>
                </label>
                <button type="submit">Save</button>
            </form>
        </ModalWithOverlay>
    );
}