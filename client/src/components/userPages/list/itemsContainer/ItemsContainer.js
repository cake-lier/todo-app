import ItemElement from "./itemElement/ItemElement";
import { ProgressSpinner } from 'primereact/progressspinner';
import EmptyPlaceholder from "../../emptyPlaceholder/EmptyPlaceholder";
import "./ItemsContainer.scss";
import { DataView } from "primereact/dataview";

export default function ItemsContainer({ anonymousId, items, members, ordering, loading, updateItem, deleteItem, displayError }) {
    const getSortField = ordering => {
        switch (ordering) {
            case 0:
            case 1:
                return "title";
            case 2:
            case 3:
                return "creationDate";
            case 4:
                return "dueDate";
            case 5:
                return "priority";
            default:
                return null;
        }
    };
    const getSortOrder = ordering => {
        switch (ordering) {
            case 0:
            case 2:
            case 4:
                return 1;
            case 1:
            case 3:
            case 5:
                return -1;
            default:
                return null;
        }
    };
    return (
        <>
            <div className="grid flex-column flex-grow-1 overflow-y-auto">
                {
                    loading
                    ? <ProgressSpinner
                          className={
                            "col-12 flex flex-grow-1 flex-column justify-content-center align-content-center "
                            + (loading ? null : "hidden")
                          }
                          style={{ width: '50px', height: '50px' }}
                          strokeWidth="2"
                          fill="var(--surface-ground)"
                          animationDuration=".5s"
                      />
                    :
                        (
                            items.length
                            ? <DataView
                                    className="w-full"
                                    value={items}
                                    layout="list"
                                    itemTemplate={item =>
                                        <ItemElement
                                            key={item._id}
                                            item={item}
                                            anonymousId={anonymousId}
                                            listMembers={members}
                                            deleteItem={deleteItem}
                                            updateItem={updateItem}
                                            displayError={displayError}
                                        />
                                    }
                                    sortField={ getSortField(ordering) }
                                    sortOrder={ getSortOrder(ordering) }
                                />
                                :
                                <div
                                    className="col-12 flex flex-grow-1 flex-column justify-content-center align-content-center">
                                    <EmptyPlaceholder
                                        title="No items to display"
                                        subtitle="Items of this list will show up here."
                                        type="items"
                                    />
                                </div>
                        )
                }
            </div>
        </>
    );
}
