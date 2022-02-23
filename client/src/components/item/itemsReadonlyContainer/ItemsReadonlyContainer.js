import EmptyPlaceholder from "../../EmptyPlaceholder";
import ReadonlyItem from "../ReadonlyItem";
import {DataView} from "primereact/dataview";
import "./ItemsReadonlyContainer.scss";

export default function ItemsReadonlyContainer({ emptyTitle, emptySubtitle, currentItems, lists, displayError, showCheckbox }) {
    return (
        <div className="grid flex-column flex-grow-1 overflow-y-auto">
            {
                currentItems.length
                ? <DataView
                      className="w-full"
                      value={ currentItems }
                      layout="list"
                      itemTemplate={
                          item => <ReadonlyItem
                              key={ item._id }
                              item={ item }
                              lists={ lists }
                              displayError={ displayError }
                              showCheckbox={ showCheckbox }
                          />
                      }
                  />
                : <div className="col-12 flex flex-grow-1 flex-column justify-content-center align-content-center">
                      <EmptyPlaceholder
                          title={ emptyTitle }
                          subtitle={ emptySubtitle }
                          type="items"
                      />
                  </div>
            }
        </div>
    );
}
