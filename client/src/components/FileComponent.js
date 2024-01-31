import { useEffect, useState } from "react";
import OptionComponent from "./OptionComponent";
import { useUpdateContext } from "../hooks/useUpdateContext";

export default function FileComponent({ options }) {
    const [data, setData] = useState(null);
    const { update, dispatch } = useUpdateContext();

    useEffect(() => {
        let url = "";
        if (options.type === "my-vault" || options.type === "folders") {
            url = "http://localhost:5050/file/getFileList?" + new URLSearchParams({ folderID: options.folderID })
        }

        if (options.type === "share-vault") {
            url = "http://localhost:5050/user/getShareFileList?" + new URLSearchParams({ userID: options.userID });
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
        if (update && update.type === "file") {
            if (update.type === "file") {
                if (update.action === "create") {
                    setData((prevData) => {
                        let nextData = [...prevData].concat(update.data);
                        return nextData;
                    });
                    dispatch({ type: "CLEAR" });
                }

                if (update.action === "update") {
                    setData((prevData) => {
                        let nextData = [...prevData];
                        const index = nextData.findIndex((file) => {
                            return file._id === update.data._id;
                        });
                        nextData[index] = update.data;
                        return nextData;
                    });
                    dispatch({ type: "CLEAR" });
                }

                if (update.action === "delete") {
                    setData((prevData) => {
                        let nextData = [...prevData];
                        const index = nextData.findIndex((file) => {
                            return file._id === update.data;
                        });
                        nextData.splice(index, 1);
                        return nextData;
                    });
                    dispatch({ type: "CLEAR" });
                }
            }
        }
    }, [update, dispatch]);

    function sizeBToMB(bytes) {
        return (bytes / (1024 * 1024)).toFixed(2) + "MB";
    }

    return (
        <tbody>
            {data && data.map((file) => {
                return (
                    <tr key={file._id} className="fileComponent">
                        <td className="truncate">{file.fileName}</td>
                        <td>{new Date(file.lastModified).toLocaleDateString("en-us", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td>{sizeBToMB(file.size)}</td>
                        <td><OptionComponent data={{ type: "file", fileID: file._id, fileName: file.fileName }}></OptionComponent></td>
                    </tr>
                );
            })}
        </tbody>
    );
}