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
            <tbody>
                {data.map((folder) => {
                    return (<tr key={folder._id} onDoubleClick={() => navigate("/folders/" + folder._id)}>
                        <td className="truncate">{folder.folderName}</td>
                        <td>{new Date(folder.lastModified).toLocaleDateString("en-us", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td>-</td>
                        <td>
                            <svg className="w-[36px] h-[36px] p-2 rounded-full cursor-pointer hover:bg-gray-300" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h48v48H0z" fill="none" />
                                <g id="Shopicon">
                                    <circle cx="24" cy="24" r="5" />
                                    <circle cx="24" cy="11" r="5" />
                                    <circle cx="24" cy="37" r="5" />
                                </g>
                            </svg>
                        </td>
                    </tr>);
                })}
            </tbody>
        );
    }
}