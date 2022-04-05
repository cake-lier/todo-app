import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export default function LinkButton(props) {
    const navigate = useNavigate();
    const handleOnClick = useCallback(
        () => navigate("/" + props.route),
        [props.route, navigate]
    );

    return <Button className={ props.className } label={ props.label } onClick={ handleOnClick } />;
}
