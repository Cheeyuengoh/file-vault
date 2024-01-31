import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { UpdateContextProvider } from "../contexts/UpdateContext";
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
        const foldersPathRegex = new RegExp("^/folders/", "i");

        if (myVaultPathRegex.test(pathname)) {
            setFolderID(user.rootFolder);
        }

        if (foldersPathRegex.test(pathname)) {
            setFolderID(id);
        }
    }, [id, pathname, user, navigate]);

    return (
        <section className="h-full p-8 flex">
            <UpdateContextProvider>
                <div className="flex flex-col items-start gap-2 p-2 border-r-2">
                    <CreateFolderComponent folderID={folderID}></CreateFolderComponent>
                    <UploadFileComponent folderID={folderID}></UploadFileComponent>
                    <button className="indexButton" onClick={() => navigate("/my-vault")}>My Vault</button>
                    <button className="indexButton" onClick={() => navigate("/share-vault")}>Share Vault</button>
                </div>
                <Outlet key={pathname}></Outlet>
            </UpdateContextProvider>
        </section>
    );
}