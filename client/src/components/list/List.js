import "./List.scss";
import {Item} from "../Item";

export function List(props) {
    // checklist
    const listName = props.name;
    const items = [{name: 'Take a picture', key: '00'},
                    {name: 'Write report', key: '01'},
                    {name: 'Production', key: '02'},
                    {name: 'Research', key: '03'}];

    return (
        <div>
            <h2 className="font-medium text-3xl text-900">{listName}</h2>
            {
                items.map((item) => {
                    return( <Item item={item} />)
                })
            }
        </div>
    )
}