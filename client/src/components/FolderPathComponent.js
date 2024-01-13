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
                setData(json.folder);
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
            <section className="flex">
                {data.path.map((folder) => {
                    return (<div className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" key={folder._id} onDoubleClick={() => {
                        if (folder.folderName === "root") {
                            navigate("/my-vault");
                        } else {
                            navigate("/folders/" + folder._id);
                        }
                    }}>
                        <p>{folder.folderName === "root" ? "my-vault" : folder.folderName}</p>
                    </div>);
                })}
                <div className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300"><p>{data.folderName === "root" ? "my-vault" : data.folderName}</p></div>
            </section>
        );
    }
}