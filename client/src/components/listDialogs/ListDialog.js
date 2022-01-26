import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {SelectButton} from "primereact/selectbutton";
import "./ListDialog.scss"

export default function ListDialog({dialogName, display, renderFooter, listName, setListName, state, color, setColor, isVisible, setVisibility, members=[]}){

    const colorOptions = [
        {icon: 'pi pi-circle-fill', id: "pastel-red-option", value: 0},
        {icon: 'pi pi-circle-fill', id: "pastel-purple-option", value: 1},
        {icon: 'pi pi-circle-fill', id: "pastel-blue-option", value: 2},
        {icon: 'pi pi-circle-fill', id: "pastel-green-option", value: 3},
        {icon: 'pi pi-circle-fill', id: "pastel-yellow-option", value: 4}
    ];

    const visibilityOptions = [
        {label: "Private", value: false},
        {label: "Public", value: true}
    ];

    const justifyTemplate = (option) => {
        return <i className={option.icon} id={option.id}></i>;
    }

    return (
        <Dialog id="list-dialog" className="w-27rem m-3" visible={display} footer={renderFooter()} closable={false} showHeader={false}>
            <div className="grid">
                <div className="col-12 mt-3 flex justify-content-center">
                    <h1 className="text-1xl">{dialogName}</h1>
                </div>
                <div className="col-12 mt-1">
                    <label
                        className="p-invalid block mb-1"
                        htmlFor="listName">Name
                    </label>
                    <InputText
                        className={"p-inputtext-sm block mb-2 w-full h-2rem" + (state ? null : " p-invalid")}
                        placeholder="List name"
                        id="listName"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                    />
                    <small id="username2-help"
                           className={(state ? "hidden" : "p-error block")}>
                        A name is required.
                    </small>
                </div>
                <div className="col-12 mt-1">
                    <h5 className="mb-1">Color</h5>
                    <SelectButton
                        className="block"
                        value={color}
                        options={colorOptions}
                        unselectable={false}
                        onChange={(e) => setColor(e.value)}
                        itemTemplate={justifyTemplate}
                    />
                </div>

                <div className="col-12 mt-1">
                    <h5 className="mb-1">Set list as: </h5>
                    <SelectButton
                        value={isVisible}
                        options={visibilityOptions}
                        unselectable={false}
                        onChange={(e) => setVisibility(e.value)}
                    />
                </div>

                <div className={"col-12 mt-1 " + (members && members.length <= 1? "hidden" : null)}>
                    <p>Mostrare i membri.</p>
                </div>
            </div>
        </Dialog>
    );
}