import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionComponent from "./OptionComponent";
import { useUpdateContext } from "../hooks/useUpdateContext";

export default function FolderComponent({ options }) {
    const [data, setData] = useState(null);
    const { update, dispatch } = useUpdateContext();
    const navigate = useNavigate();

    useEffect(() => {
        let url = "";
        if (options.type === "my-vault" || options.type === "folders") {
            url = "http://localhost:5050/folder/getFolderList?" + new URLSearchParams({ folderID: options.folderID })
        }

        if (options.type === "share-vault") {
            url = "http://localhost:5050/user/getShareFolderList?" + new URLSearchParams({ userID: options.userID });
        }

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

    useEffect(() => {
        if (update && update.type === "folder") {
            if (update.action === "create") {
                setData((prevData) => {
                    let nextData = [...prevData];
                    nextData.push(update.data);
                    return nextData;
                });
                dispatch({ type: "CLEAR" });
            }

            if (update.action === "update") {
                setData((prevData) => {
                    let nextData = [...prevData];
                    const index = nextData.findIndex((folder) => {
                        return folder._id === update.data._id;
                    });
                    nextData[index] = update.data;
                    return nextData;
                });
                dispatch({ type: "CLEAR" });
            }

            if (update.action === "delete") {
                setData((prevData) => {
                    let nextData = [...prevData];
                    const index = nextData.findIndex((folder) => {
                        return folder._id === update.data;
                    });
                    nextData.splice(index, 1);
                    return nextData;
                });
                dispatch({ type: "CLEAR" });
            }
        }
    }, [update, dispatch]);

    return (
        <tbody>
            {data && data.map((folder) => {
                return (
                    <tr key={folder._id} className="folderComponent" onDoubleClick={() => navigate("/folders/" + folder._id)}>
                        <td className="truncate">{folder.folderName}</td>
                        <td>{new Date(folder.lastModified).toLocaleDateString("en-us", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td>-</td>
                        <td><OptionComponent data={{ type: "folder", folderID: folder._id }}></OptionComponent></td>
                    </tr>
                );
            })}
        </tbody>
    );
}