import {Checkbox} from "primereact/checkbox";
import ChipTag from "./ChipTag";
import {Chip} from "primereact/chip";
import ChipAssignee from "./ChipAssignee";
import {useEffect, useState} from "react";
import axios from "axios";
import "./Item.scss"

export default function ReadonlyItem({ item, lists, displayError }) {
    const [assignees, setAssignees] = useState(null);
    useEffect(() => {
        axios.get(`/items/${ item._id }/assignees`)
            .then(
                assignees => setAssignees(assignees.data),
                error => displayError(error.response.data.error)
            );
    }, [setAssignees, displayError, item]);
    if (assignees === null) {
        return null;
    }
    return (
        <div className="flex justify-content-between m-2 w-full">
            <div>
                <label className="text-base ml-5 p-1">
                    List: { lists.filter(l => l._id === item.listId)[0].title }
                </label>
                <div className="field-checkbox m-1 mb-0">
                    <Checkbox
                        className="read-only-checkbox"
                        inputId={ item._id }
                        name="item"
                        checked={ !!item.completionDate }
                    />
                    <label className="text-xl" htmlFor={ item._id }>
                        { item.title }
                    </label>
                    <div className="flex align-items-center">
                        <p className="count-items flex m-1 text-xl" style={{ color: "#E61950" }}>
                            x{ item.count }
                        </p>
                    </div>
                    <span className={(item.priority ? "priority-star-fill" : "priority-star")}>
                        <i className={ (item.priority ? "pi pi-star-fill" : "pi pi-star") + " ml-2" } />
                    </span>
                </div>
                <div className="flex align-items-center flex-wrap pl-5">
                    {
                        item.tags.map(tag =>
                            <ChipTag
                                key={ tag._id }
                                itemId={ item._id }
                                tag={ tag }
                                isRemovable={ false }
                            />
                        )
                    }
                    {
                        item.dueDate
                            ? <Chip
                                  className="mr-1 mb-1"
                                  label={ new Date(item.dueDate).toLocaleDateString("en-GB")}
                                  icon="pi pi-calendar"
                            />
                            : null
                    }
                    {
                        item.reminderDate
                            ? <Chip
                                  className="mr-1 mb-1"
                                  label={ new Date(item.reminderDate).toLocaleString("en-GB").replace(/:[^:]*$/, "") }
                                  icon="pi pi-bell"
                            />
                            : null
                    }
                    {
                        assignees.map(assignee =>
                            <ChipAssignee
                                key={ assignee._id }
                                itemId={ item._id }
                                assignee={ assignee }
                                isRemovable={ false }
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}
