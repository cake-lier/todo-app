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
                        barObject[listId] = v.filter(i => i.listId === listId).length;
                        return barObject;
                    })
                )
            );
        const chartData = {
            labels: getLabelsByDateRange(this.props.filter),
            datasets: listIds.map(listId => ({
                label: this.props.lists.filter(l => l._id === listId)[0].title,
                data: datasets,
                parsing: {
                    yAxisKey: listId
                },
                backgroundColor: [ "#FB9DB1", "#B5A9EF", "#9FD7F9", "#FFF599", "#E9F5A3" ]
            }))
        };
        const options = {
            scales: {
                y: {
                    stacked: true
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
        return <Chart
            id="itemsCompleted"
            type="bar"
            options={ options }
            data={ chartData }
        />;
    }
}

export default ItemsChart;
