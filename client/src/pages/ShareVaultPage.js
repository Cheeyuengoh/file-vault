import { useEffect, useMemo } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import HeaderComponent from "../components/HeaderComponent";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import { useSessionStorage } from "../hooks/useSessionStorage";

export default function ShareVaultPage() {
    const { user } = useAuthContext();
    const [sessionStorage, setSessionStorage] = useSessionStorage("vault");
    const options = useMemo(() => {
        return {
            type: "share-vault",
            userID: user._id,
            accessToken: user.accessToken
        }
    }, [user._id, user.accessToken]);

    useEffect(() => {
        if (sessionStorage.vault !== "share-vault") {
            setSessionStorage({ vault: "share-vault" });
        }
    }, [sessionStorage, setSessionStorage]);

    return (
        <section className="p-2">
            <table className="table-fixed w-full">
                <HeaderComponent></HeaderComponent>
                <FolderComponent options={options}></FolderComponent>
                <FileComponent options={options}></FileComponent>
            </table>
        </section>
    );
}