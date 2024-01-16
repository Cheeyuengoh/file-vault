import { useNavigate } from "react-router-dom";

export default function PathComponent({ folderPath }) {
    const navigate = useNavigate();

    if (folderPath) {
        return (
            <section className="flex">
                <div className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" onDoubleClick={() => navigate("/my-vault")}>
                    <p>my vault</p>
                </div>
                {folderPath.map((folder) => {
                    return (
                        <div className="py-1 px-4 rounded-full cursor-pointer whitespace-nowrap hover:bg-gray-300" key={folder._id} onDoubleClick={() => {
                            navigate("/folders/" + folder._id);
                        }}>
                            <p>{folder.folderName}</p>
                        </div>
                    );
                })}
            </section>
        );
    }
}