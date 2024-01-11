import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateFolderContext } from "../hooks/useUpdateFolderContext";

export default function FolderComponent({ folderID }) {
    const { user } = useAuthContext();
    const { folder, dispatch } = useUpdateFolderContext();
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:5050/folder/getFolderList?" + new URLSearchParams({ folderID }), {
                    headers: {
                        "Authorization": "Bearer " + user.accessToken
                    },
                    signal: abortController.signal
                });
                const json = await response.json();
                setData(json.folderList);
            } catch (err) {
                console.log(err);
            }
        }

        if (!data) fetchData();

        return () => {
            abortController.abort();
        }
    }, [data, folderID, user.accessToken]);

    useEffect(() => {
        if (folder) {
            setData((prevData) => {
                let nextData = [...prevData];
                nextData.push(folder);
                return nextData;
            });
            dispatch({ type: "CLEAR" });
        }
    }, [folder, dispatch]);

    if (data) {
        return (
            <section>
                <h3>Folder components</h3>
                {data.map((folder) => {
                    return (<div key={folder._id} onDoubleClick={() => navigate("/folders/" + folder._id)}>
                        <p>{folder.folderName}</p>
                    </div>);
                })}
            </section>
        );
    }
}