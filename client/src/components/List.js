import React, { useState } from 'react';
import { Checkbox } from 'primereact/checkbox';

export function List(props) {
    const listName = props.name;
    const items = [{name: 'Take a picture', id: '00'},
                    {name: 'Write report', id: '01'},
                    {name: 'Production', id: '02'},
                    {name: 'Research', id: '03'}];
    const [selectedItems, setSelectedItems] = useState(Array.prototype);

    // when checkbox is checked/unchecked, update selectedItems[]
    const onItemChange = (e) => {
        let _selectedItems = [...selectedItems];

        if (e.checked) {
            _selectedItems.push(e.value);
        }
        else {
            for (let i = 0; i < _selectedItems.length; i++) {
                const selectedItem = _selectedItems[i];

                if (selectedItem.id === e.value.id) {
                    _selectedItems.splice(i, 1);
                    break;
                }
            }
        }
        setSelectedItems(_selectedItems);
    }

    return (
        <div>
            <div className="list">
                <h2>{listName}</h2>
                {
                    items.map((item) => {
                        return (
                            <div id={item.id} className="field-checkbox">
                                <Checkbox inputId={item.id}
                                          name="item" value={item}
                                          onChange={onItemChange}
                                          checked={selectedItems.some((i) => i.id === item.id)}
                                />
                                <label htmlFor={item.id}>{item.name}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}