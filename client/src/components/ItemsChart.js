import {Component} from "react";
import _ from "lodash";
import {Chart} from "primereact/chart";
import {filterByDateRange, getLabelsByDateRange, groupByDateRange} from "../utils/dates";

class ItemsChart extends Component {

    render() {
        const data =
            _.sortBy(
                _.toPairs(
                    _.groupBy(
                        this.props
                            .items
                            .filter(i => i.completionDate !== null && filterByDateRange(this.props.filter, i.completionDate)),
                        v => v.listId
                    )
                ),
                ([, v]) => _.maxBy(v, i => new Date(i.completionDate))
            )
            .slice(-5);
        const currentItems = data.flatMap(([, v]) => v);
        const listIds = data.map(([k]) => k);
        const datasets =
            _.map(
                _.groupBy(currentItems, i => groupByDateRange(this.props.filter, i.completionDate)),
                (v, k) => Object.assign(
                    { x: k },
                    ...listIds.map(listId => {
                        const barObject = {};
                        barObject[listId] = _.sum(v.filter(i => i.listId === listId).map(i => i.count));
                        return barObject;
                    })
                )
            );
        const colors = [ "#FB9DB1", "#B5A9EF", "#9FD7F9", "#FFF599", "#E9F5A3" ];
        const chartData = {
            labels: getLabelsByDateRange(this.props.filter),
            datasets: listIds.map((listId, index) => ({
                label: this.props.lists.filter(l => l._id === listId)[0].title,
                data: datasets,
                parsing: {
                    yAxisKey: listId
                },
                backgroundColor: colors[index]
            }))
        };
        const options = {
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: this.props.filter === 0
                          ? `${ new Date().getFullYear() - 1 } - ${ new Date().getFullYear() }`
                          : (this.props.filter === 1
                             ? `${ new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString("en-GB") } - `
                               + `${ new Date().toLocaleDateString("en-GB") }`
                             : `${ new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString("en-GB") } - `
                               + `${ new Date().toLocaleDateString("en-GB") }`),
                    font: {
                        size: 20
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 16
                    },
                    itemFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 16
                    }
                }
            }
        };
        return (
            <>
                <Chart id="itemsCompleted" type="bar" options={ options } data={ chartData } />
                <table className="absolute opacity-0" style={{ zIndex: -1 }}>
                    <caption className="opacity-0">
                        Items completed during the last
                        { this.props.filter === 0 ? " year " : (this.props.filter === 1 ? " month " : " week ") }
                        by list
                    </caption>
                    <thead>
                        <tr className="opacity-0">
                            <td />
                            {
                                listIds.map(listId => {
                                    const listName = this.props.lists.filter(l => l._id === listId)[0].title;
                                    return <th key={ listId } scope="col">{ listName }</th>;
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getLabelsByDateRange(this.props.filter).map(dateLabel =>
                                <tr key={ dateLabel }>
                                    <th scope="row">{ dateLabel }</th>
                                    { listIds.map(listId =>
                                        <td key={ listId }>{
                                            datasets.filter(i => i.x === dateLabel && i.hasOwnProperty(listId))[0]?.[listId] ?? 0
                                        }</td>
                                    ) }
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </>
        );

    }
}

export default ItemsChart;
