import "./List.scss";
import {Item} from "../Item";
import { Button } from 'primereact/button';

export function List(props) {
    // checklist
    const listName = props.name;
    const items = [{name: 'Take a picture', key: '00'},
                    {name: 'Write report', key: '01'},
                    {name: 'Production', key: '02'},
                    {name: 'Research', key: '03'}];

    // create item
    const onNewItem = () => {
        console.log("new item");
    }

    return (
        <div>
            <h2 className="font-medium text-3xl text-900">{listName}</h2>
            <Button label="New Task" icon="pi pi-plus" onClick={onNewItem}/>
            {
                items.map((item) => {
                    return( <Item item={item} />)
                })
            }
        </div>
    )
}