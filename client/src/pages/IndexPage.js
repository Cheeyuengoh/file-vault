import { Outlet } from "react-router-dom";

export default function IndexPage() {
    return (
        <section>
            Index
            <Outlet></Outlet>
        </section>
    );
}