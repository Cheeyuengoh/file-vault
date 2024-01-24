import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateContext } from "../hooks/useUpdateContext";
import ModalWithOverlay from "./templates/ModalWithOverlay";

export default function RemoveModal({ setShowModal, setShowDropdown, data }) {
    const { user } = useAuthContext();
    const {dispatch} = useUpdateContext();

    async function handleSubmit(e) {
        e.preventDefault();

        if (data.type === "folder") {

        }

        if (data.type === "file") {
            try {
                const response = await fetch("http://localhost:5050/file/deleteFile?" + new URLSearchParams({ fileID: data.fileID }), {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + user.accessToken
                    }
                });
                const json = await response.json();
                dispatch({ type: "FILE_DELETE", payload: data.fileID });
                setShowModal(false);
                setShowDropdown(false);
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <ModalWithOverlay setShowModal={setShowModal}>
            <form onSubmit={handleSubmit}>
                <p>Confirm remove this {data.type}?</p>
                <button type="submit">Remove</button>
            </form>
        </ModalWithOverlay>
    );
}