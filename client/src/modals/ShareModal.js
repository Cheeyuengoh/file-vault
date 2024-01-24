import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ModalWithOverlay from "./templates/ModalWithOverlay";

export function ShareModal({ setShowModal, setShowDropdown, data }) {
    const { user } = useAuthContext();
    const [role, setRole] = useState("editor");
    const [emails, setEmails] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            let url, body;
            if (data.type === "folder") {
                url = "http://localhost:5050/folder/shareFolder";
                body = {
                    folderID: data.folderID,
                    emails,
                    role,
                    action: "update"
                }
            }

            if (data.type === "file") {
                url = "http://localhost:5050/file/shareFile";
                body = {
                    fileID: data.fileID,
                    emails,
                    role,
                    action: "update"
                }
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.accessToken
                },
                body: JSON.stringify(body)
            });
            const json = await response.json();
            console.log(json);
            setShowModal(false);
            setShowDropdown(false);
        } catch (err) {
            console.log(err);
        }
    }

    function handleKeyDownForm(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    }

    function handleKeyDownInput(e) {
        if (e.keyCode === 13) {
            let value = e.target.value;
            if (value) {
                setEmails((prevData) => {
                    let nextData = [...prevData];
                    if (!nextData.includes(value)) {
                        nextData.push(value);
                    }
                    return nextData;
                })
            }
        }
    }

    function handleClick(email) {
        setEmails((prevData) => {
            let nextData = [...prevData];
            nextData.splice(nextData.indexOf(email), 1);
            return nextData;
        });
    }

    return (
        <ModalWithOverlay setShowModal={setShowModal}>
            <form onKeyDown={handleKeyDownForm} onSubmit={handleSubmit}>
                <label>
                    <p>Email</p>
                    <input type="text" onKeyDown={handleKeyDownInput}></input>
                </label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                </select>
                <div>
                    {emails.map((email) => {
                        return (<div key={email}>
                            <p>{email}</p>
                            <button type="button" onClick={() => handleClick(email)}>X</button>
                        </div>);
                    })}
                </div>
                <button type="submit">Share</button>
            </form>
        </ModalWithOverlay>
    );
}