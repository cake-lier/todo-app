import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dialog} from "primereact/dialog";
import React, {useState} from "react";
import {Button} from "primereact/button";
import axios from "axios";


export function CreateItemDialog({listId, displayDialog, setDisplayDialog, appendItem}){
    const [itemName, setItemName] = useState('');
    const [itemNum, setItemNum] = useState(1);
    const onNewItem = () => {
        setDisplayDialog(false);
        axios.post(
            "/lists/" + listId + "/items",
            {
                listId: listId,
                title: itemName,
                count: itemNum,
                assignees: []
            }
        ).then(item => {
            console.log("created item titled " + item.data.title);
            appendItem(item.data);
            setItemName('');
            setItemNum(1);
        });
    }

    const renderFooter = () => {
        return (
            <div className="flex justify-content-center">
                <Button label='Create' onClick={onNewItem}/>
            </div>
        )
    }

    return (
        <Dialog header='Create a new task' footer={renderFooter} dismissableMask={true} closable={false}
                visible={displayDialog} onHide={() => setDisplayDialog(false)}>
            <label htmlFor="inputItemName">Name</label>
            <span id="inputItemName" className="p-float-label">
                    <InputText id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)}/>
                    <label htmlFor="itemName">Task Name</label>
                </span>

            <label htmlFor="num">Task number</label>
            <div className="grid">
                <div className="field col-12 md:col-3">
                    <InputNumber
                        inputId="num" value={itemNum} onValueChange={(e) => setItemNum(e.value)} showButtons
                        buttonLayout="horizontal"
                        decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary"
                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                        min={1}/>
                </div>
            </div>
        </Dialog>
    )
}