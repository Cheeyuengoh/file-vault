import { useAuthContext } from "../hooks/useAuthContext";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import FolderPathComponent from "../components/FolderPathComponent";
import HeaderComponent from "../components/HeaderComponent";

export default function MyVaultPage() {
    const { user } = useAuthContext();

    return (
        <section className="w-full">
            <FolderPathComponent key={"path" + user.rootFolder} folderID={user.rootFolder}></FolderPathComponent>
            <table className="table-fixed w-full">
                <HeaderComponent></HeaderComponent>
                <FolderComponent key={"folder" + user.rootFolder} folderID={user.rootFolder}></FolderComponent>
                <FileComponent key={"file" + user.rootFolder} folderID={user.rootFolder}></FileComponent>
            </table>
        </section>
    );
}