import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSessionStorage } from "../hooks/useSessionStorage";
import HeaderComponent from "../components/HeaderComponent";
import FolderComponent from "../components/FolderComponent3";
import FileComponent from "../components/FileComponent3";

export default function ShareVaultPage() {
    const { user } = useAuthContext();
    const [sessionStorage, setSessionStorage] = useSessionStorage("vault");
    const [folderList, setFolderList] = useState(null);
    const [fileList, setFileList] = useState(null);

    useEffect(() => {
        if (sessionStorage.vault !== "share-vault") {
            setSessionStorage({ vault: "share-vault" });
        }
    }, [sessionStorage, setSessionStorage]);

    useEffect(() => {
        let abortController = new AbortController();
        async function fetchData() {
            const urls = [
                "http://localhost:5050/user/getShareFolderList?" + new URLSearchParams({ userID: user._id }),
                "http://localhost:5050/user/getShareFileList?" + new URLSearchParams({ userID: user._id }),
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

    return (
        <section>
            <table className="table-fixed w-full">
                <HeaderComponent></HeaderComponent>
                <FolderComponent folderList={folderList}></FolderComponent>
                <FileComponent folderList={folderList}></FileComponent>
            </table>
        </section>
    );
}