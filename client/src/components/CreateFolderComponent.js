import { useState } from "react";
import CreateFolderModal from "../modals/CreateFolderModal";

export default function CreateFolderComponent({ folderID }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <section>
            <button className="indexButton" onClick={() => setShowModal(true)}>New Folder</button>
            {showModal && <CreateFolderModal setShowModal={setShowModal} folderID={folderID}></CreateFolderModal>}
        </section>
    );
}