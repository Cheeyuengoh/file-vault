import { useEffect, useMemo } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import HeaderComponent from "../components/HeaderComponent";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import { useSessionStorage } from "../hooks/useSessionStorage";

export default function MyVaultPage() {
    const { user } = useAuthContext();
    const [sessionStorage, setSessionStorage] = useSessionStorage("vault");
    const options = useMemo(() => {
        return {
            type: "my-vault",
            folderID: user.rootFolder,
            accessToken: user.accessToken
        }
    }, [user.rootFolder, user.accessToken]);

    useEffect(() => {
        if (sessionStorage.vault !== "my-vault") {
            setSessionStorage({ vault: "my-vault" });
        }
    }, [sessionStorage, setSessionStorage]);

    return (
        <section className="w-full">
            <table className="table-fixed w-full">
                <HeaderComponent></HeaderComponent>
                <FolderComponent options={options}></FolderComponent>
                <FileComponent options={options}></FileComponent>
            </table>
        </section>
    );
}