import { useAuthContext } from "../hooks/useAuthContext";

export default function UploadFileComponent({ folderID }) {
    const { user } = useAuthContext();

    async function handleChange(e) {
        const data = new FormData();
        data.append("userID", user._id);
        data.append("folderID", folderID);
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
            console.log(json);
            if(response.ok){
                e.target.value = null;
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section>
            <form>
                <label>
                    <p>Upload File</p>
                    <input type="file" multiple onChange={handleChange}></input>
                </label>
            </form>
        </section>
    );
}