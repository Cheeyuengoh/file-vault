export default function OptionDropdown({ setShowDropdown }) {
    //download
    //rename modal
    //share modal
    //remove modal

    return (
        <div>
            <div className="absolute top-8 right-28 p-3 z-20 rounded-md shadow-lg bg-white flex flex-col ">
                <p>Download</p>
                <p>Rename</p>
                <p>Share</p>
                <p>Remove</p>
            </div>
            <div className="fixed top-0 left-0 z-10 w-screen h-screen" onClick={() => setShowDropdown(false)}></div>
        </div>
    );
}