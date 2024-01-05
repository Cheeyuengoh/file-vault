import { useParams } from "react-router-dom";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";

export default function FoldersPage() {
    const { folderID } = useParams();

    return (
        <section>
            <FolderComponent folderID={folderID}></FolderComponent>
            <FileComponent folderID={folderID}></FileComponent>
        </section>
    );
}