import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateContext } from "../hooks/useUpdateContext";
import { useSessionStorage } from "../hooks/useSessionStorage";
import PathComponent from "../components/PathComponent";
import HeaderComponent from "../components/HeaderComponent";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";

export default function FoldersPage() {
    const { user } = useAuthContext();
    const { update, dispatch } = useUpdateContext();
    const [sessionStorage] = useSessionStorage("vault");
    const { id } = useParams();
    const [folderPath, setFolderPath] = useState(null);
    const [folderList, setFolderList] = useState(null);
    const [fileList, setFileList] = useState(null);

    useEffect(() => {
        let abortController = new AbortController();
        async function fetchData() {
            const urls = [
                "http://localhost:5050/folder/getFolderPath?" + new URLSearchParams({ folderID: id, vault: sessionStorage.vault, userID: user._id }),
                "http://localhost:5050/folder/getFolderList?" + new URLSearchParams({ folderID: id }),
                "http://localhost:5050/file/getFileList?" + new URLSearchParams({ folderID: id }),
            ];
            try {
                const fetchPromises = urls.map(url => fetch(url, {
                    headers: {
                        "Authorization": "Bearer " + user.accessToken
                    }
                }));
                const responses = await Promise.all(fetchPromises);
                const jsonPromises = responses.map(response => response.json());
                const jsons = await Promise.all(jsonPromises);
                setFolderPath(jsons[0].data);
                setFolderList(jsons[1].data);
                setFileList(jsons[2].data);
            } catch (err) {
                console.log(err);
            }
        }

        if (!folderPath || !folderList || !fileList) {
            fetchData();
        }

        return () => {
            abortController.abort();
        }
    }, [id, sessionStorage.vault, user, folderPath, folderList, fileList]);

    useEffect(() => {
        if (update) {
            if (update.type === "folder") {
                if (update.action === "create") {
                    setFolderList((prevData) => {
                        let nextData = [...prevData];
                        nextData.push(update.data);
                        return nextData;
                    });
                    dispatch({ type: "CLEAR" });
                }

                if (update.action === "update") {
                    setFolderList((prevData) => {
                        let nextData = [...prevData];
                        const index = nextData.findIndex((folder) => {
                            return folder._id === update.data._id;
                        });
                        nextData[index] = update.data;
                        return nextData;
                    });
                    dispatch({ type: "CLEAR" });
                }
            }

            if (update.type === "file") {
                if (update.action === "create") {
                    setFileList((prevData) => {
                        let nextData = [...prevData].concat(update.data);
                        return nextData;
                    });
                    dispatch({ type: "CLEAR" });
                }

                if (update.action === "update") {
                    setFileList((prevData) => {
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
                    setFileList((prevData) => {
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

    return (
        <section>
            <PathComponent folderPath={folderPath} vault={sessionStorage.vault}></PathComponent>
            <table className="table-fixed w-full">
                <HeaderComponent></HeaderComponent>
                <FolderComponent folderList={folderList}></FolderComponent>
                <FileComponent fileList={fileList}></FileComponent>
            </table>
        </section>
    );
}