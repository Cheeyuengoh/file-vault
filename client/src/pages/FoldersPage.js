import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSessionStorage } from "../hooks/useSessionStorage";
import PathComponent from "../components/PathComponent";
import HeaderComponent from "../components/HeaderComponent";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";

export default function FoldersPage() {
    const { user } = useAuthContext();
    const { id } = useParams();
    const [sessionStorage] = useSessionStorage("vault");

    const options = useMemo(() => {
        return {
            type: "folders",
            folderID: id,
            accessToken: user.accessToken,
            vault: sessionStorage.vault,
            userID: user._id,
        }
    }, [id, sessionStorage.vault, user._id, user.accessToken]);

    return (
        <section className="p-2">
            <PathComponent options={options}></PathComponent>
            <table className="table-fixed w-full">
                <HeaderComponent></HeaderComponent>
                <FolderComponent options={options}></FolderComponent>
                <FileComponent options={options}></FileComponent>
            </table>
        </section>
    );
}