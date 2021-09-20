import { Chart } from "@antv/g2";
const Big = require("big.js");
Big.DP = 2;

export default {

    changeDataAndFormat(chart, config, data, total) {
        chart.scale(config.field2, {
            formatter: (val, num) => {
                let a = new Big(val);
                let b = new Big(total);
                let c = 0;
                if (b > 0) {
                    c = a.div(b).toNumber();
                }
                console.log("c", c);
                return c;
            }
        });
        chart.interval().label(config.field2, count => {
            let a = new Big(count);
            let b = new Big(total);
            let c = 0;
            if (b > 0) {
                c = a
                    .div(b)
                    .times(100)
                    .toNumber();
            }
            return {
                content: data => {
                    return `${data[config.field1]}: ${c}%`;
                }
            };
        })
        .tooltip(`${config.field1}*${config.field2}`, (name, count) => {
            let a = new Big(count);
            let b = new Big(total);
            let c = 0;
            if (b > 0) {
                c = a
                .div(b)
                .times(100)
                .toNumber();
            }
            return {
                name: name,
                value: `${c}% (${count})`
            };
        });
        chart.changeData(data);
    },
    // 环形图
    createRingChart(
        container,
        data,
        config = { field1: "", field2: "" },
        total,
        height,
        chartObj
    ) {
        let chart = null;
        if (chartObj) {
            chart = chartObj;
            chart.clear();
        } else {
            chart = new Chart({
                container,
                autoFit: true,
                height
            });
        }
        chart.data(data);
        chart.scale(config.field2, {
            formatter: (val, num) => {
                let a = new Big(val);
                let b = new Big(total);
                let c = 0;
                if (b > 0) {
                    c = a.div(b).toNumber();
                }
                console.log("c", c);
                return c;
            }
        });
        chart.coordinate("theta", {
            radius: 0.75,
            innerRadius: 0.6
        });
        chart.tooltip({
            showTitle: false,
            showMarkers: false,
            itemTpl:
                '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });

        chart
            .interval()
            .adjust("stack")
            .position(config.field2)
            .color(config.field1)
            .label(config.field2, count => {
                let a = new Big(count);
                let b = new Big(total);
                let c = 0;
                if (b > 0) {
                    c = a
                        .div(b)
                        .times(100)
                        .toNumber();
                }
                return {
                    content: data => {
                        return `${data[config.field1]}: ${c}%`;
                    }
                };
            })
            .tooltip(`${config.field1}*${config.field2}`, (name, count) => {
                let a = new Big(count);
                let b = new Big(total);
                let c = 0;
                if (b > 0) {
                    c = a
                    .div(b)
                    .times(100)
                    .toNumber();
                }
                return {
                    name: name,
                    value: `${c}% (${count})`
                };
            });

        chart.interaction("element-active");

        chart.render();
        return chart;
    },
    // 基本柱状图
    createBasicColumnChart(
        id,
        list,
        filedConfig = { field1: "", field2: "", field2Alias: "" },
        width = 650,
        height = 500,
        otherConfig = {
            appendPadding: [0, 0, 0, 0],
            tickInterval: 5
        }
    ) {
        var chart = new Chart({
            container: id,
            // forceFit: true,
            width,
            height,
            appendPadding: otherConfig.appendPadding
        });
        chart.source(list);
        chart.scale(filedConfig.field2, {
            alias: filedConfig.field2Alias,
            tickInterval: otherConfig.tickInterval
        });
        chart.axis(filedConfig.field2, {});
        chart
            .interval()
            .position(`${filedConfig.field1}*${filedConfig.field2}`);
        chart.render();
        return chart;
    },
    // 分组柱状图
    createFoldChart(
        container,
        data,
        config = { field1: "", field2: "", groupField: "" },
        width,
        height,
        otherConfig = {
            appendPadding: [0, 0, 0, 0],
            tickInterval: 20
        }
    ) {
        const chart = new Chart({
            container,
            autoFit: true,
            width,
            height,
            appendPadding: otherConfig.appendPadding
        });
        chart.data(data);
        chart.scale(config.field2, {
            nice: true,
            tickInterval: otherConfig.tickInterval
        });
        chart.tooltip({
            showMarkers: false,
            shared: true
        });
        chart
            .interval()
            .position(`${config.field1}*${config.field2}`)
            .color(config.groupField)
            .adjust([
                {
                    type: "dodge",
                    marginRatio: 0
                }
            ]);
        chart.render();
        return chart;
    }
};
