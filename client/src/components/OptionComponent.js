import { useState } from "react";

export default function OptionComponent() {
    const [showPopout, setShowPopout] = useState(false);

    return (
        <div>
            <svg className="w-[36px] h-[36px] p-2 rounded-full cursor-pointer hover:bg-gray-300" onClick={() => setShowPopout(true)} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h48v48H0z" fill="none" />
                <g id="Shopicon">
                    <circle cx="24" cy="24" r="5" />
                    <circle cx="24" cy="11" r="5" />
                    <circle cx="24" cy="37" r="5" />
                </g>
            </svg>
            {showPopout && <div className="w-screen h-screen">
                <div>
                    <p>Test</p>
                </div>
                <div className="w-full h-full" onClick={() => setShowPopout(false)}></div>
            </div>}

        </div>
    );
}