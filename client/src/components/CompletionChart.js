import { Component } from "react";
import { Chart } from "primereact/chart";
import _ from "lodash";
import { filterByDateRange } from "../utils/dates";

class CompletionChart extends Component {

    render() {
        const datasets =
            _.sortBy(
                _.toPairs(
                    _.groupBy(
                        this.props.items.filter(i => filterByDateRange(this.props.filter, i.completionDate)), v => v.listId
                    )
                ),
                ([, v]) => _.maxBy(v, i => new Date(i.completionDate))
            )
            .slice(-5)
            .flatMap(([k, v]) => {
                const listTitle = this.props.lists.filter(l => l._id === k)[0].title;
                if (this.props.filter > 2) {
                    return [
                        [ listTitle + " (Done)", v.filter(i => i.completionDate !== null).length ],
                        [ listTitle + " (To be done)", v.filter(i => i.completionDate === null).length ]
                    ];
                }
                return [ [ listTitle + " (Done)", v.filter(i => i.completionDate !== null).length ] ];
            });
        const chartData = {
            labels: datasets.map(([k]) => k),
            datasets: [
                {
                    data: datasets.map(([, v]) => v),
                    backgroundColor:
                        this.props.filter < 3
                        ? [ "#FB9DB1", "#B5A9EF", "#9FD7F9", "#FFF599", "#E9F5A3" ]
                        : [
                            "#FB9DB1",
                            "#F73B64",
                            "#B5A9EF",
                            "#6A53DF",
                            "#9FD7F9",
                            "#3FAEF3",
                            "#FFF599",
                            "#FFEB33",
                            "#E9F5A3",
                            "#D2EB47"
                        ]
                }
            ]
        }
        const options = {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                },
                tooltip: {
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
            id="completionRate"
            type="doughnut"
            options={ options }
            data={ chartData }
        />;
    }
}

export default CompletionChart;
