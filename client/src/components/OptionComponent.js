import { useState } from "react";
import OptionDropdown from "../dropdowns/OptionDropdown";

export default function OptionComponent({ data }) {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="relative" onDoubleClick={(e) => e.stopPropagation()}>
            <svg className="w-[36px] h-[36px] p-2 rounded-full cursor-pointer hover:bg-gray-300" onClick={() => { setShowDropdown(true); }} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h48v48H0z" fill="none" />
                <g id="Shopicon">
                    <circle cx="24" cy="24" r="5" />
                    <circle cx="24" cy="11" r="5" />
                    <circle cx="24" cy="37" r="5" />
                </g>
            </svg>
            {showDropdown && <OptionDropdown setShowDropdown={setShowDropdown} data={data}></OptionDropdown>}
        </div>
    );
}