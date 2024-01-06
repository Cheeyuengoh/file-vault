import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import CreateFolderComponent from "../components/CreateFolderComponent";
import UploadFileComponent from "../components/UploadFileComponent";

export default function MyVaultPage() {
    const { user } = useAuthContext();
    const [data, setData] = useState(null);

    useEffect(() => {
        let abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:5050/folder/getFolderByUserID?" + new URLSearchParams({ userID: user._id }), {
                    headers: {
                        "Authorization": "Bearer " + user.accessToken
                    },
                    signal: abortController.signal
                });
                const json = await response.json();
                setData(json.folder);
            } catch (err) {
                console.log(err);
            }
        }

        if (!data) fetchData();

        return () => {
            abortController.abort();
        }
    }, [data, user._id, user.accessToken]);

    if (data) {
        return (
            <section>
                <CreateFolderComponent parentFolderID={data._id}></CreateFolderComponent>
                <UploadFileComponent folderID={data._id}></UploadFileComponent>
                <FolderComponent folderID={data._id}></FolderComponent>
                <FileComponent folderID={data._id}></FileComponent>
            </section>
        );
    }
}