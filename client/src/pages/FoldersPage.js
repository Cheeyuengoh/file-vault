import { useParams } from "react-router-dom";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import FolderPathComponent from "../components/FolderPathComponent";

export default function FoldersPage() {
    const { id } = useParams();

    return (
        <section>
            <FolderPathComponent folderID={id}></FolderPathComponent>
            <FolderComponent folderID={id}></FolderComponent>
            <FileComponent folderID={id}></FileComponent>
        </section>
    );
}