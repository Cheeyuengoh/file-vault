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
        <section className="flex">
            <div className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" onDoubleClick={() => navigate("/" + options.vault)}>
                <p>{options.vault}</p>
            </div>
            {data && data.map((folder) => {
                return (
                    <div className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" key={folder._id} onDoubleClick={() => {
                        navigate("/folders/" + folder._id);
                    }}>
                        <p>{folder.folderName}</p>
                    </div>
                );
            })}
        </section>
    );
}