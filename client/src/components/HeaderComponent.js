export default function HeaderComponent() {
    return (
        <thead className="text-left">
            <tr>
                <th className="min-w-[150px]">Name</th>
                <th className="w-[150px]">Last Modified</th>
                <th className="w-[150px]">File Size</th>
                <th className="w-[100px]"></th>
            </tr>
        </thead>
    );
}