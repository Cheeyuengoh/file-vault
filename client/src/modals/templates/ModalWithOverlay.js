export default function ModalWithOverlay({ children, setShowModal }) {
    return (
        <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
            <div className="p-[12px] z-20 bg-gray-600 rounded-md">
                {children}
            </div>
            <div className="absolute top-0 left-0 h-full w-full z-10 bg-black bg-opacity-80" onClick={() => setShowModal(false)}></div>
        </div>
    );
}