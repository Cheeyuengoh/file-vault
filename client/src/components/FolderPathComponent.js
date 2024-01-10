import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function FolderPathComponent({ folderID }) {
    const { user } = useAuthContext();
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:5050/folder/getFolderPath?" + new URLSearchParams({ folderID }), {
                    headers: {
                        "Authorization": "Bearer " + user.accessToken
                    },
                    signal: abortController.signal
                });
                const json = await response.json();
                setData(json.path);
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
                <h3>Path</h3>
                {data.map((folder) => {
                    return (<div key={folder._id} onDoubleClick={() => {
                        if (folder.folderName === "root") {
                            navigate("/my-vault");
                        } else {
                            navigate("/folders/" + folder._id);
                        }
                    }}>
                        <p>{folder.folderName === "root" ? "my-vault" : folder.folderName}</p>
                    </div>);
                })}
            </section>
        );
    }
}