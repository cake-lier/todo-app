// import axios from "axios";
// import { TreeTable } from 'primereact/treetable';
// import { Column } from 'primereact/column';
// import "./MyDayItem.scss"
// import EmptyTaskSVG from "../EmptyTaskSVG";
// import Moment from "moment";
// import {useCallback, useEffect, useState} from "react";
// import {Checkbox} from "primereact/checkbox";
// import {Tag} from "primereact/tag";
//
// export default function MyDayItem({displayError}) {
//     const [items, setItems] = useState([]);
//
//     const populateItems = useCallback((type, itemList, key) => {
//         if (itemList.length > 0) {
//             let children = [];
//             itemList.forEach(i => {
//                 children = [...children, {
//                     key: i._id,
//                     data: i
//                 }]
//             })
//             const newItems = [
//                 {
//                     key: key,
//                     data: {
//                         title: type,
//                         dueDate: null
//                     },
//                     children: children
//                 }
//             ];
//             console.log(newItems)
//             return newItems;
//         }
//     },[])
//
//     useEffect(() => {
//         axios.get(
//             "/items"
//         ).then(
//             res => {
//                 if (!res) {
//                     const today = Moment(Date.now())
//                     const dueTask = res.data.filter(i => i.dueDate !== null)
//                     const pastDue = dueTask.filter(i => Moment(i.dueDate).isBefore(today, 'day'))
//                     const dueToday = dueTask.filter(i => Moment(i.dueDate).isSame(today, 'day'))
//                     const upcoming = dueTask.filter(i => Moment(i.dueDate).isAfter(today, 'day'))
//                     const newItems = [
//                         ...items,
//                         populateItems("Past due", pastDue, 0),
//                         populateItems("Due today", dueToday, 1),
//                         populateItems("Upcoming", upcoming, 2)
//                     ]
//                     console.log(newItems);
//                     setItems(newItems)
//                     console.log(items)
//                 }
//             },
//             errors => {
//                 displayError(errors);
//             }
//         )
//     }, [])
//
//     const rowTemplate = (node, column) => {
//         if (node.key) {
//             return(
//                 <>
//                     <h1>{node.title}</h1>
//                 </>
//             );
//         }
//         return (
//             <div className="grid align-items-center">
//                 <div className="flex justify-content-between m-2">
//                     <div>
//                         <div key={node._id} className="field-checkbox m-1">
//                             <Checkbox inputId={node._id}
//                                       name="item"
//                                       value={node}
//                             />
//                             <label htmlFor={node._id}>{node.title}</label>
//                         </div>
//                         <div className="flex align-items-center flex-wrap">
//                             <Tag className="flex m-1 p-tag-rounded" icon="pi pi-calendar">Jan 11</Tag>
//                             <Tag className="flex m-1 p-tag-rounded" icon="pi pi-circle-on">Unibo</Tag>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className={"card flex flex-grow-1 " + (items.length ? null : "justify-content-center align-items-center")}>
//             <TreeTable className={"flex-basis " + (items.length ? null : "hidden")}
//                        value={items}
//                        scrollHeight="80vh"
//                        scrollable>
//                 <Column field="title" header="Title" expander></Column>
//             </TreeTable>
//             <div className={(items.length ? "hidden" : null)}>
//                 <EmptyTaskSVG/>
//             </div>
//         </div>
//     );
// }