import { Chart } from "primereact/chart";
import _ from "lodash";
import { filterByDateRange } from "../../../../utils/dates";
import EmptyPlaceholder from "../../emptyPlaceholder/EmptyPlaceholder";

export default function CompletionChart(props) {
    const datasets =
        _.sortBy(
            _.toPairs(
                _.groupBy(
                    props.items.filter(i => filterByDateRange(props.filter, i.completionDate)), v => v.listId
                )
            ),
            ([, v]) => _.maxBy(v, i => new Date(i.completionDate))
        )
        .slice(-5)
        .flatMap(([k, v]) => {
            const listTitle = props.lists.filter(l => l._id === k)[0].title;
            if (props.filter > 2) {
                return [
                    {
                        title: listTitle + " (Done)",
                        key: k + "_d",
                        value: _.sum(v.filter(i => i.completionDate !== null).map(i => i.count))
                    },
                    {
                        title: listTitle + " (To do)",
                        key: k + "_t",
                        value: _.sum(v.filter(i => i.completionDate === null).map(i => i.count))
                    }
                ];
            }
            return [ {
                title: listTitle + " (Done)",
                key: k,
                value: _.sum(v.filter(i => i.completionDate !== null).map(i => i.count))
            } ];
        });
    const chartData = {
        labels: datasets.map(e => e.title),
        datasets: [
            {
                data: datasets.map(e => e.value),
                backgroundColor:
                    props.filter < 3
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
    };
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
    if (chartData.datasets[0].data.length === 0) {
        return <EmptyPlaceholder
            title={
                "No "
                + (props.filter === 0
                   ? "yearly"
                   : (props.filter === 1
                      ? "monthly"
                      : (props.filter === 2 ? "weekly" : "all time")))
                + " report to display"
            }
            subtitle={
                "Complete an item "
                + (props.filter === 0
                    ? "this year "
                    : (props.filter === 1
                        ? "this month "
                        : (props.filter === 2 ? "this week " : "")))
                + "and then come back here"
            }
            type="reports"
        />;
    }
    return (
        <>
            <Chart id="completionRate" type="doughnut" options={ options } data={ chartData } />
            <table className="absolute opacity-0" style={{ zIndex: -1 }}>
                <caption className="opacity-0">
                    {
                        props.filter > 2
                        ? "Percentage of completed and non-completed items by list"
                        : ("Percentage of completed items by list in the last "
                           + (props.filter === 0 ? "year" : (props.filter === 1 ? "month" : "week")))
                    }
                </caption>
                <thead>
                    <tr>{ datasets.map(e => <th key={ e.key } scope="col">{ e.title }</th>) }</tr>
                </thead>
                <tbody>
                    <tr>{ datasets.map(e => <td key={ e.key }>{ e.value }</td>) }</tr>
                </tbody>
            </table>
        </>
    );
}
