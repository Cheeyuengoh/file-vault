import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import jsFileDownload from "js-file-download";
import RenameModal from "../modals/RenameModal";
import ShareModal from "../modals/ShareModal";
import RemoveModal from "../modals/RemoveModal";

export default function OptionDropdown({ setShowDropdown, data }) {
    const { user } = useAuthContext();
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    async function handleClick() {
        try {
            const response = await fetch("http://localhost:5050/file/downloadFile?" + new URLSearchParams({ fileID: data.fileID }), {
                headers: {
                    "Authorization": "Bearer " + user.accessToken
                },
                responseType: "blob"
            });
            const blob = await response.blob();
            jsFileDownload(blob, data.fileName);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div className="absolute top-8 right-14 p-3 z-20 rounded-md shadow-lg bg-white flex flex-col ">
                {data.type === "file" && <button className="optionButton" onClick={handleClick}>Download</button>}
                <button className="optionButton" onClick={() => setShowRenameModal(true)}>Rename</button>
                <button className="optionButton" onClick={() => setShowShareModal(true)}>Share</button>
                <button className="optionButton" onClick={() => setShowRemoveModal(true)}>Remove</button>
                {showRenameModal && <RenameModal setShowModal={setShowRenameModal} setShowDropdown={setShowDropdown} data={data}></RenameModal>}
                {showShareModal && <ShareModal setShowModal={setShowShareModal} setShowDropdown={setShowDropdown} data={data}></ShareModal>}
                {showRemoveModal && <RemoveModal setShowModal={setShowRemoveModal} setShowDropdown={setShowDropdown} data={data}></RemoveModal>}
            </div>
            <div className="fixed top-0 left-0 z-10 w-screen h-screen" onClick={() => setShowDropdown(false)}></div>
        </div >
    );
}