import { useAuthContext } from "../hooks/useAuthContext";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import FolderPathComponent from "../components/FolderPathComponent";

export default function MyVaultPage() {
    const { user } = useAuthContext();

    return (
        <section>
            <FolderPathComponent key={"path" + user.rootFolder} folderID={user.rootFolder}></FolderPathComponent>
            <FolderComponent key={"folder" + user.rootFolder} folderID={user.rootFolder}></FolderComponent>
            <FileComponent key={"file" + user.rootFolder} folderID={user.rootFolder}></FileComponent>
        </section>
    );
}