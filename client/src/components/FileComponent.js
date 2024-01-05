import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export default function FileComponent({ folderID }) {
    const { user } = useAuthContext();
    const [data, setData] = useState(null);

    useEffect(() => {
        let abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:5050/file/getFileList?" + new URLSearchParams({ folderID }), {
                    headers: {
                        "Authorization": "Bearer " + user.accessToken
                    },
                    signal: abortController.signal
                });
                const json = await response.json();
                setData(json.fileList);
            } catch (err) {
                console.log(err);
            }
        }

        if (!data) fetchData();

        return () => {
            abortController.abort();
        }
    }, [data, folderID, user.accessToken]);

    if (data) {
        return (
            <section>
                <h3>File components</h3>
                {data.map((file) => {
                    return (<div key={file._id}>
                        <p>{file.filename}</p>
                        <p>{file.mimeType}</p>
                        <p>{file.size}</p>
                    </div>);
                })}
            </section>
        );
    }
}