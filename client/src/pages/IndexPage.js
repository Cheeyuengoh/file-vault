import { useState } from "react";
import { Outlet } from "react-router-dom";
import CreateFolderModal from "../modals/CreateFolderModal";

export default function IndexPage() {
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    
    return (
        <section>
            Index
            <button onClick={() => setShowCreateFolderModal(true)}>New Folder</button>
            {showCreateFolderModal && <CreateFolderModal setShowModal={setShowCreateFolderModal}></CreateFolderModal>}
            <Outlet></Outlet>
        </section>
    );
}