import { useState } from "react";
import CreateFolderModal from "../modals/CreateFolderModal";

export default function CreateFolderComponent({ parentFolderID }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <section>
            <button onClick={() => setShowModal(true)}>New Folder</button>
            {showModal && <CreateFolderModal setShowModal={setShowModal} parentFolderID={parentFolderID}></CreateFolderModal>}
        </section>
    );
}