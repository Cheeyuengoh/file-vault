import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateFileContext } from "../hooks/useUpdateFileContext";
import OptionComponent from "./OptionComponent";

export default function FileComponent({ folderID }) {
    const { user } = useAuthContext();
    const { file, dispatch } = useUpdateFileContext();
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

    useEffect(() => {
        if (file) {
            setData((prevData) => {
                let nextData = [...prevData].concat(file);
                return nextData;
            });
            dispatch({ type: "CLEAR" });
        }
    }, [file, dispatch]);

    function sizeBToMB(bytes) {
        return (bytes / (1024 * 1024)).toFixed(2) + "MB";
    }

    if (data) {
        return (
            <tbody>
                {data.map((file) => {
                    return (<tr key={file._id}>
                        <td className="truncate">{file.filename}</td>
                        <td>{new Date(file.lastModified).toLocaleDateString("en-us", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td>{sizeBToMB(file.size)}</td>
                        <td><OptionComponent></OptionComponent></td>
                    </tr>);
                })}
            </tbody>
        );
    }
}