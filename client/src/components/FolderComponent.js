import { useNavigate } from "react-router-dom";
import OptionComponent from "./OptionComponent";

export default function FolderComponent({ folderList }) {
    const navigate = useNavigate();

    if (folderList) {
        return (
            <tbody>
                {folderList.map((folder) => {
                    return (
                        <tr key={folder._id} onDoubleClick={() => navigate("/folders/" + folder._id)}>
                            <td className="truncate">{folder.folderName}</td>
                            <td>{new Date(folder.lastModified).toLocaleDateString("en-us", { day: "numeric", month: "short", year: "numeric" })}</td>
                            <td>-</td>
                            <td><OptionComponent data={{ type: "folder", folderID: folder._id }}></OptionComponent></td>
                        </tr>
                    );
                })
                }
            </tbody >
        );
    }
}