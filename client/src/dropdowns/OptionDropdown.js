import { useState } from "react";
import { ShareModal } from "../modals/ShareModal";

export default function OptionDropdown({ setShowDropdown, data }) {
    const [showShareModal, setShowShareModal] = useState(false);

    return (
        <div>
            <div className="absolute top-8 right-28 p-3 z-20 rounded-md shadow-lg bg-white flex flex-col ">
                <p className="py-1 px-4">Download</p>
                <p className="py-1 px-4">Rename</p>
                <button className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" onClick={() => setShowShareModal(true)}>Share</button>
                <p className="py-1 px-4">Remove</p>
                {showShareModal && <ShareModal setShowModal={setShowShareModal} data={data}></ShareModal>}
            </div>
            <div className="fixed top-0 left-0 z-10 w-screen h-screen" onClick={() => setShowDropdown(false)}></div>
        </div>
    );
}