import { Card } from "primereact/card";
import Error404Message from "../../../components/publicPages/error404/errorMessage/Error404Message";

export default function Error404() {
    return (
        <div className="grid h-screen align-items-center justify-content-center">
            <div className="col-12 sm:col-10 md:col-8 lg:col-6">
                <Card><Error404Message /></Card>
            </div>
        </div>
    );
}
