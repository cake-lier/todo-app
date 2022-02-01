import {Tooltip} from "primereact/tooltip";
import {Button} from "primereact/button";
import {Tag} from "primereact/tag";
import React, {useState} from "react";

export function ItemCount({maxCount}) {
    const [count, setCount] = useState(0);
    const addCount = () => {
        setCount(count + 1 <= maxCount ? count + 1 : maxCount);
    }
    const subCount = () => {
        setCount(count - 1 >= 0 ? count - 1 : 0);
    }

    return(
        <div className="flex align-items-center">
            <Tooltip target=".count-display" autoHide={false}>
                <div className="flex align-items-center">
                    <Button type="button" icon="pi pi-plus" onClick={addCount} className="p-button-rounded p-button-success m-1" />
                    <Button type="button" icon="pi pi-minus" onClick={subCount} className="p-button-rounded p-button-danger m-1" />
                </div>
            </Tooltip>
            <Tag className="count-display flex m-1 p-tag-rounded">{count}/{maxCount}</Tag>
        </div>
    )
}