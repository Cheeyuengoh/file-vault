import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateContext } from "../hooks/useUpdateContext";
import { useSessionStorage } from "../hooks/useSessionStorage";
import HeaderComponent from "../components/HeaderComponent";
import FolderComponent from "../components/FolderComponent3";
import FileComponent from "../components/FileComponent3";

export default function MyVaultPage() {
    const { user } = useAuthContext();
    const { update, dispatch } = useUpdateContext();
    const [sessionStorage, setSessionStorage] = useSessionStorage("vault");
    const [folderList, setFolderList] = useState(null);
    const [fileList, setFileList] = useState(null);

    useEffect(() => {
        if (sessionStorage.vault !== "my-vault") {
            setSessionStorage({ vault: "my-vault" });
        }
    }, [sessionStorage, setSessionStorage]);

    useEffect(() => {
        let abortController = new AbortController();
        async function fetchData() {
            const urls = [
                "http://localhost:5050/folder/getFolderList?" + new URLSearchParams({ folderID: user.rootFolder }),
                "http://localhost:5050/file/getFileList?" + new URLSearchParams({ folderID: user.rootFolder }),
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
                setFolderList(jsons[0].data);
                setFileList(jsons[1].data);
            } catch (err) {
                console.log(err);
            }
        }

        if (!folderList || !fileList) {
            fetchData();
        }

        return () => {
            abortController.abort();
        }
    }, [user, folderList, fileList]);

    useEffect(() => {
        if (update) {
            if (update.type === "folder") {
                setFolderList((prevData) => {
                    let nextData = [...prevData];
                    nextData.push(update.data);
                    return nextData;
                });
                dispatch({ type: "CLEAR" });
            }

            if (update.type === "file") {
                setFileList((prevData) => {
                    let nextData = [...prevData].concat(update.data);
                    return nextData;
                });
                dispatch({ type: "CLEAR" });
            }
        }
    }, [update, dispatch]);

    return (
        <section className="w-full">
            <table className="table-fixed w-full">
                <HeaderComponent></HeaderComponent>
                <FolderComponent folderList={folderList}></FolderComponent>
                <FileComponent fileList={fileList}></FileComponent>
            </table>
        </section>
    );
}