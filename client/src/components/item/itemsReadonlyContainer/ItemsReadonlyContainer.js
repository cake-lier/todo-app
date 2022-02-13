import EmptyPlaceholder from "../../EmptyPlaceholder";
import ReadonlyItem from "../ReadonlyItem";
import "./ItemsReadonlyContainer.scss";

export default function ItemsReadonlyContainer({ emptyTitle, emptySubtitle, currentItems, lists, displayError }) {
    return (
        <div className="grid flex-column flex-grow-1">
            {
                currentItems.length
                ? currentItems.map(
                    item => <ReadonlyItem key={ item._id } item={ item } lists={ lists } displayError={ displayError } />
                  )
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
