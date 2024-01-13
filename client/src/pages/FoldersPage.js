import { useParams } from "react-router-dom";
import FolderComponent from "../components/FolderComponent";
import FileComponent from "../components/FileComponent";
import FolderPathComponent from "../components/FolderPathComponent";
import HeaderComponent from "../components/HeaderComponent";

export default function FoldersPage() {
    const { id } = useParams();

    return (
        <section>
            <FolderPathComponent key={"path" + id} folderID={id}></FolderPathComponent>
            <table className="table-fixed w-full">
                <HeaderComponent></HeaderComponent>
                <FolderComponent key={"folder" + id} folderID={id}></FolderComponent>
                <FileComponent key={"file" + id} folderID={id}></FileComponent>
            </table>
        </section>
    );
}