import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateContext } from "../hooks/useUpdateContext";

export default function UploadFileComponent({ folderID }) {
    const { user } = useAuthContext();
    const { dispatch } = useUpdateContext();

    async function handleChange(e) {
        const data = new FormData();
        data.append("folderID", folderID);
        data.append("action", "create");
        for (const file of e.target.files) {
            data.append("files", file);
        }

        try {
            const response = await fetch("http://localhost:5050/file/uploadFile", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + user.accessToken
                },
                body: data
            });
            const json = await response.json();
            if (response.ok) {
                e.target.value = null;
                dispatch({ type: "FILE_CREATE", payload: json.data });
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section>
            <form>
                <label>
                    <p className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300">Upload File</p>
                    <input className="hidden" type="file" multiple onChange={handleChange}></input>
                </label>
            </form>
        </section>
    );
}