import { useParams } from "react-router-dom";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import CreateFolderComponent from "../components/CreateFolderComponent";
import UploadFileComponent from "../components/UploadFileComponent";

export default function FoldersPage() {
    const { folderID } = useParams();

    return (
        <section>
            <CreateFolderComponent parentFolderID={folderID}></CreateFolderComponent>
            <UploadFileComponent folderID={folderID}></UploadFileComponent>
            <FolderComponent folderID={folderID}></FolderComponent>
            <FileComponent folderID={folderID}></FileComponent>
        </section>
    );
}