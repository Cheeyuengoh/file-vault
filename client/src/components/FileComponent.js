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
        console.log(data);
        return (
            <section>
                File components
            </section>
        );
    }
}