import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import CreateFolderComponent from "../components/CreateFolderComponent";
import UploadFileComponent from "../components/UploadFileComponent";

export default function IndexPage() {
    const { user } = useAuthContext();
    const { pathname } = useLocation();
    const { id } = useParams();
    const [folderID, setFolderID] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }

        const myVaultPathRegex = new RegExp("^/my-vault$", "i");
        const foldersPathRegex = new RegExp("^/folders", "i");

        if (myVaultPathRegex.test(pathname)) {
            setFolderID(user.rootFolder);
        }

        if (foldersPathRegex.test(pathname)) {
            setFolderID(id);
        }
    }, [id, pathname, user, navigate]);

    if (folderID) {
        return (
            <section>
                <h3>Index</h3>
                <CreateFolderComponent folderID={folderID}></CreateFolderComponent>
                <UploadFileComponent folderID={folderID}></UploadFileComponent>
                <Outlet></Outlet>
            </section>
        );
    }
}