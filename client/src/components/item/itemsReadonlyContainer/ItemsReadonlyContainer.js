import EmptyPlaceholder from "../../EmptyPlaceholder";
import {Checkbox} from "primereact/checkbox";
import {Tag} from "primereact/tag";
import {Avatar} from "primereact/avatar";
import "./ItemsReadonlyContainer.scss";

export default function ItemsReadonlyContainer({ currentItems, lists }) {
    const colors = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];
    return (
        <div className="grid flex-column flex-grow-1">
            {
                currentItems.length
                ? currentItems.map(item =>
                      <div key={ item._id } className="flex justify-content-between m-2">
                          <div>
                              <div className="field-checkbox m-1 mb-0">
                                  <Checkbox
                                      inputId={ item._id }
                                      name="item"
                                      checked={ !!item.completionDate }
                                  />
                                  <label htmlFor={ item._id }>
                                      { item.title } - From: { lists.filter(l => l.id === item.listId)[0].title }
                                  </label>
                                  <div className="flex align-items-center">
                                      <p className="count-items flex m-1 text-xl" style={{ color: "#E61950" }}>
                                          x{ item.count }
                                      </p>
                                  </div>
                                  <span>
                                      <i className={ (item.priority ? "pi pi-star-fill" : "pi pi-star") + " ml-2" } />
                                  </span>
                              </div>
                              <div className="flex align-items-center flex-wrap pl-4">
                                  {
                                      item.tags.map(tag =>
                                          <Tag
                                              key={ tag._id }
                                              className="flex m-1 p-tag-rounded"
                                              icon={ <i className={"pi mr-1 pi-circle-on " + (colors[tag.colorIndex]) } /> }
                                          >
                                              { tag.title }
                                          </Tag>
                                      )
                                  }
                                  {
                                      item.dueDate
                                      ? <Tag className="flex m-1 p-tag-rounded" icon={ <i className="pi mr-1 pi-calendar" /> }>
                                              { new Date(item.dueDate).toLocaleDateString("en-GB")}
                                        </Tag>
                                      : null
                                  }
                                  {
                                      item.reminderDate
                                      ? <Tag className="flex m-1 p-tag-rounded" icon={ <i className="pi mr-1 pi-bell" /> }>
                                              { new Date(item.reminderDate).toLocaleString("en-GB").replace(/:[^:]*$/, "") }
                                        </Tag>
                                      : null
                                  }
                                  {
                                      item.assignees.map(assignee =>
                                          <Tag
                                              key={ assignee._id }
                                              className="flex m-1 p-tag-rounded"
                                              icon={
                                                  <Avatar
                                                      size="small"
                                                      className="p-avatar-circle"
                                                      image={
                                                          assignee.profilePicturePath
                                                          ? assignee.profilePicturePath
                                                          : "/static/images/default_profile_picture.jpg"
                                                      }
                                                      alt={ assignee.username + " profile picture" }
                                                      tooltip={ assignee.username }
                                                  />
                                              }
                                          >
                                              x{ assignee.count }
                                          </Tag>
                                      )
                                  }
                              </div>
                          </div>
                      </div>
                  )
                : <div className="col-12 flex flex-grow-1 flex-column justify-content-center align-content-center">
                      <EmptyPlaceholder
                          title={ "No items to display" }
                          subtitle={ "Items that have a due date will show up here." }
                          type={"items"}
                      />
                  </div>
            }
        </div>
    );
}
