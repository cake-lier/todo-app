import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button as PrimeButton } from "primereact/button";

export default function Button(props) {
    const navigate = useNavigate();
    const handleOnClick = useCallback(
        () => navigate("/" + props.route), [props.route, navigate]
    );

    return <PrimeButton className={ props.className } label={ props.label } onClick={ handleOnClick } />;
}
