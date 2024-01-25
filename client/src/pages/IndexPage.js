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
        <section className="flex">
            <UpdateContextProvider>
                <div>
                    <CreateFolderComponent folderID={folderID}></CreateFolderComponent>
                    <UploadFileComponent folderID={folderID}></UploadFileComponent>
                    <button className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" onClick={() => navigate("/my-vault")}>My Vault</button>
                    <button className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" onClick={() => navigate("/share-vault")}>Share Vault</button>
                </div>
                <Outlet key={pathname}></Outlet>
            </UpdateContextProvider>
        </section>
    );
}