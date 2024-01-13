import { useState } from "react";
import CreateFolderModal from "../modals/CreateFolderModal";

export default function CreateFolderComponent({ folderID }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <section>
            <button className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" onClick={() => setShowModal(true)}>New Folder</button>
            {showModal && <CreateFolderModal setShowModal={setShowModal} folderID={folderID}></CreateFolderModal>}
        </section>
    );
}