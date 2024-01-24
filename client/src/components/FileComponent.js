import OptionComponent from "./OptionComponent";

export default function FileComponent({ fileList }) {
    function sizeBToMB(bytes) {
        return (bytes / (1024 * 1024)).toFixed(2) + "MB";
    }

    if (fileList) {
        return (
            <tbody>
                {fileList.map((file) => {
                    return (
                        <tr key={file._id}>
                            <td className="truncate">{file.fileName}</td>
                            <td>{new Date(file.lastModified).toLocaleDateString("en-us", { day: "numeric", month: "short", year: "numeric" })}</td>
                            <td>{sizeBToMB(file.size)}</td>
                            <td><OptionComponent data={{ type: "file", fileID: file._id }}></OptionComponent></td>
                        </tr>
                    );
                })}
            </tbody>
        );
    }
}