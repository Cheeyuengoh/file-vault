import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PathComponent({ options }) {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let url = "http://localhost:5050/folder/getFolderPath?" + new URLSearchParams({ folderID: options.folderID, vault: options.vault, userID: options.userID });

        let abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await fetch(url, {
                    headers: {
                        "Authorization": "Bearer " + options.accessToken
                    },
                    signal: abortController.signal
                });
                const json = await response.json();
                setData(json.data);
            } catch (err) {
                console.log(err);
            }
        }

        if (!data) fetchData();

        return () => {
            abortController.abort();
        }
    }, [data, options]);

    return (
        <section className="flex gap-2">
            <button className="pathButton" onClick={() => navigate("/" + options.vault)}>{options.vault}</button>
            {data && data.map((folder) => {
                return (
                    <button className="pathButton" key={folder._id} onClick={() => navigate("/folders/" + folder._id)}>{folder.folderName}</button>
                );
            })}
        </section>
    );
}