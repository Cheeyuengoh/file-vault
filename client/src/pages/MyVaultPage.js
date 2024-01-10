import { useAuthContext } from "../hooks/useAuthContext";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import FolderPathComponent from "../components/FolderPathComponent";

export default function MyVaultPage() {
    const { user } = useAuthContext();

    return (
        <section>
            <FolderPathComponent folderID={user.rootFolder}></FolderPathComponent>
            <FolderComponent folderID={user.rootFolder}></FolderComponent>
            <FileComponent folderID={user.rootFolder}></FileComponent>
        </section>
    );
}