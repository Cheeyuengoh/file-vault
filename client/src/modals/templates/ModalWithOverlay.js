export default function ModalWithOverlay({ children, setShowModal }) {
    return (
        <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
            <div className="z-20">
                {children}
            </div>
            <div className="absolute top-0 left-0 h-full w-full z-10 bg-black bg-opacity-50" onClick={() => setShowModal(false)}></div>
        </div>
    );
}