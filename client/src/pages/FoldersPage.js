import { useParams } from "react-router-dom";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import FolderPathComponent from "../components/FolderPathComponent";

export default function FoldersPage() {
    const { id } = useParams();

    return (
        <section>
            <FolderPathComponent key={"path" + id} folderID={id}></FolderPathComponent>
            <FolderComponent key={"folder" + id} folderID={id}></FolderComponent>
            <FileComponent key={"file" + id} folderID={id}></FileComponent>
        </section>
    );
}