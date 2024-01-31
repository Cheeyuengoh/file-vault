import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ModalWithOverlay from "./templates/ModalWithOverlay";

export default function ShareModal({ setShowModal, setShowDropdown, data }) {
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
            <form className="shareForm" onKeyDown={handleKeyDownForm} onSubmit={handleSubmit}>
                <label>
                    <p>Email</p>
                    <input className="shareInput" type="text" onKeyDown={handleKeyDownInput}></input>
                </label>
                <select className="shareInput" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                </select>
                <div>
                    {emails.map((email) => {
                        return (<div key={email} className="flex justify-between">
                            <p>{email}</p>
                            <button className="p-1 rounded-full cursor-pointer hover:bg-rose-200" type="button" onClick={() => handleClick(email)}>
                                <svg width="16px" height="16px" viewBox="0 0 24 24" id="cross" xmlns="http://www.w3.org/2000/svg">
                                    <path id="primary" d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                                </svg>
                            </button>
                        </div>);
                    })}
                </div>
                <button className="shareButton" type="submit">Share</button>
            </form>
        </ModalWithOverlay>
    );
}