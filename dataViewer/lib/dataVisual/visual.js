/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @package dataVisual
 */

/**
* @type Jannchie
* @email jannchie@gmail.com
* @create date 2018-05-02 13:17:10
* @desc Visual core code
*/

/**
 * 绘制
 * 
 * @param {array} data 数据
 * @param {string} svgDom 绘制节点
 * @param {number} offoset 排名偏移
 */
function dataVisual(data, svgDom, offoset = 0, callback = () => { }) {

    /**
     * 时间节点 (Unique)
     */
    var date = [];
    data.forEach(element => {
        if (date.indexOf(element["date"]) == -1) {
            date.push(element["date"]);
        }
    });
    let rate = [];
    var auto_sort = dataVisualConfig.auto_sort;
    var time = auto_sort ? (date.sort((x, y) => new Date(x) - new Date(y))) : date;

    var use_semilogarithmic_coordinate = dataVisualConfig.use_semilogarithmic_coordinate;
    var big_value = dataVisualConfig.big_value;
    var divide_by = dataVisualConfig.divide_by;
    var divide_color_by = dataVisualConfig.divide_color_by;
    var name_list = [];
    var changeable_color = dataVisualConfig.changeable_color;
    var divide_changeable_color_by_type = dataVisualConfig.divide_changeable_color_by_type;
    data
        .sort((a, b) => Number(b.value) - Number(a.value))
        .forEach(e => {
            if (name_list.indexOf(e.name) == -1) {
                name_list.push(e.name);
            }
        });
    var baseTime = 3000;

    // 选择颜色
    function getColor(d) {
        var r = 0.0;
        if (changeable_color) {
            var colorRange = d3.interpolateCubehelix(
                dataVisualConfig.color_range[0],
                dataVisualConfig.color_range[1]
            );
            if (divide_changeable_color_by_type && d["type"] in dataVisualConfig.color_ranges) {
                var colorRange = d3.interpolateCubehelix(
                    dataVisualConfig.color_ranges[d["type"]][0],
                    dataVisualConfig.color_ranges[d["type"]][1]
                );
            }
            var v =
                Math.abs(rate[d.name] - rate["MIN_RATE"]) /
                (rate["MAX_RATE"] - rate["MIN_RATE"]);
            if (isNaN(v) || v == -1) {
                return colorRange(0.6);
            }
            return colorRange(v);
        }

        if (d[divide_color_by] in dataVisualConfig.color)
            return dataVisualConfig.color[d[divide_color_by]];
        else {
            return d3.schemeCategory10[
                Math.floor(d[divide_color_by].charCodeAt() % 10)
            ];
        }
    }

    var showMessage = dataVisualConfig.showMessage;
    var allow_up = dataVisualConfig.allow_up;
    var always_up = dataVisualConfig.always_up;
    var interval_time = dataVisualConfig.interval_time;
    var text_y = dataVisualConfig.text_y;
    var itemLabel = dataVisualConfig.itemLabel;
    var typeLabel = dataVisualConfig.typeLabel;
    // 长度小于display_barInfo的bar将不显示barInfo
    var display_barInfo = dataVisualConfig.display_barInfo;
    // 显示类型
    if (dataVisualConfig.use_type_info === undefined) {
        var use_type_info = (divide_by != "name") ? true : false;
    } else {
        var use_type_info = dataVisualConfig.use_type_info
    }
    // 使用计数器
    var use_counter = dataVisualConfig.use_counter;
    // 每个数据的间隔日期
    var step = dataVisualConfig.step;
    var long = dataVisualConfig.long;
    var format = dataVisualConfig.format;
    var left_margin = dataVisualConfig.left_margin;
    var right_margin = dataVisualConfig.right_margin;
    var top_margin = dataVisualConfig.top_margin;
    var bottom_margin = dataVisualConfig.bottom_margin;
    var timeFormat = dataVisualConfig.timeFormat;
    var item_x = dataVisualConfig.item_x;
    var max_number = dataVisualConfig.max_number;
    var reverse = dataVisualConfig.reverse;
    var text_x = dataVisualConfig.text_x;
    var offset = dataVisualConfig.offset;
    var animation = dataVisualConfig.animation;
    var deformat = dataVisualConfig.deformat;
    dataVisualConfig.imgs = Object.assign(dataVisualConfig.imgs, external_imgs);

    const margin = {
        left: left_margin,
        right: right_margin,
        top: top_margin,
        bottom: bottom_margin
    };
    var background_color = dataVisualConfig.background_color;

    d3.select("body").attr("style", "background:" + background_color);

    var enter_from_0 = dataVisualConfig.enter_from_0;
    interval_time /= 3;
    var lastData = [];
    var currentdate = time[0].toString();
    var currentData = [];
    var lastname;
    const svg = d3.select(svgDom);

    const width = svg.attr("width");
    const height = svg.attr("height");
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom - 32;
    //var dateLabel_y = height - margin.top - margin.bottom - 32;;
    const xValue = d => Number(d.value);
    const yValue = d => d.name;

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    const xAxisG = g
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`);
    const yAxisG = g.append("g");

    xAxisG
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", 100);

    var xScale = d3.scaleLinear();
    if (use_semilogarithmic_coordinate) {
        xScale = d3.scalePow().exponent(0.5);
    } else {
        xScale = d3.scaleLinear();
    }
    const yScale = d3
        .scaleBand()
        .paddingInner(0.3)
        .paddingOuter(0);

    const xTicks = 10;
    const xAxis = d3
        .axisBottom()
        .scale(xScale)
        .ticks(xTicks)
        .tickPadding(20)
        .tickFormat(d => {
            if (d <= 0) {
                return "";
            }
            return d3.format(",.0f")(d);
        })
        .tickSize(-innerHeight);

    const yAxis = d3
        .axisLeft()
        .scale(yScale)
        .tickPadding(5)
        .tickSize(-innerWidth);

    var dateLabel_switch = dataVisualConfig.dateLabel_switch;
    var dateLabel_x = dataVisualConfig.dateLabel_x;
    var dateLabel_y = dataVisualConfig.dateLabel_y;
    //dateLabel位置
    if (dateLabel_x == null || dateLabel_y == null) {
        dateLabel_x = innerWidth; //默认
        dateLabel_y = innerHeight; //默认
    } //是否隐藏
    if (dateLabel_switch == false) {
        dateLabel_switch = "hidden";
    } else {
        dateLabel_switch = "visible";
    }

    var dateLabel = g
        .insert("text")
        .data(currentdate)
        .attr("class", "dateLabel")
        .attr("style:visibility", dateLabel_switch)
        .attr("x", dateLabel_x)
        .attr("y", dateLabel_y)
        .attr("text-anchor", function () {
            return "end";
        })
        .text(currentdate);

    var topLabel = g
        .insert("text")
        .attr("class", "topLabel")
        .attr("x", item_x)
        .attr("y", text_y);

    function dataSort() {
        if (reverse) {
            currentData.sort(function (a, b) {
                if (Number(a.value) == Number(b.value)) {
                    var r1 = 0;
                    var r2 = 0;
                    for (let index = 0; index < a.name.length; index++) {
                        r1 = r1 + a.name.charCodeAt(index);
                    }
                    for (let index = 0; index < b.name.length; index++) {
                        r2 = r2 + b.name.charCodeAt(index);
                    }
                    return r2 - r1;
                } else {
                    return Number(a.value) - Number(b.value);
                }
            });
        } else {
            currentData.sort(function (a, b) {
                if (Number(a.value) == Number(b.value)) {
                    var r1 = 0;
                    var r2 = 0;
                    for (let index = 0; index < a.name.length; index++) {
                        r1 = r1 + a.name.charCodeAt(index);
                    }
                    for (let index = 0; index < b.name.length; index++) {
                        r2 = r2 + b.name.charCodeAt(index);
                    }
                    return r2 - r1;
                } else {
                    return Number(b.value) - Number(a.value);
                }
            });
        }
    }

    function getCurrentData(date) {
        rate = [];
        currentData = [];
        indexList = [];

        datakey = 0;
        data.forEach(element => {
            if (element["date"] == date && parseFloat(element["value"]) != 0) {
                datakey++;
                element.key = datakey;
                currentData.push(element);
            }
        });
        datakey = null;

        rate["MAX_RATE"] = 0;
        rate["MIN_RATE"] = 1;
        currentData.forEach(e => {
            _cName = e.name;
            lastData.forEach(el => {
                if (el.name == e.name) {
                    rate[e.name] = Number(Number(e.value) - Number(el.value));
                }
            });
            if (rate[e.name] == undefined) {
                rate[e.name] = rate["MIN_RATE"];
            }
            if (rate[e.name] > rate["MAX_RATE"]) {
                rate["MAX_RATE"] = rate[e.name];
            } else if (rate[e.name] < rate["MIN_RATE"]) {
                rate["MIN_RATE"] = rate[e.name];
            }
        });
        currentData = currentData.slice(0, max_number);
        dataSort();

        d3.transition("2")
            .each(redraw)
            .each(change);
        lastData = currentData;
    }

    if (showMessage) {
        // 左1文字
        var topInfo = g
            .insert("text")
            .attr("class", "growth")
            .attr("x", 0)
            .attr("y", text_y)
            .text(itemLabel);

        // 右1文字
        g.insert("text")
            .attr("class", "growth")
            .attr("x", text_x)
            .attr("y", text_y)
            .text(typeLabel);

        // 榜首日期计数
        if (use_counter == true) {
            var days = g
                .insert("text")
                .attr("class", "days")
                .attr("x", text_x + offset)
                .attr("y", text_y);
        } else {
            // 显示榜首type
            if (use_type_info == true) {
                var top_type = g
                    .insert("text")
                    .attr("class", "days")
                    .attr("x", text_x + offset)
                    .attr("y", text_y);
            }
        }
    }

    var lastname;
    var counter = {
        value: 1
    };

    var avg = 0;
    var enter_from_now = true;

    function redraw() {
        if (currentData.length == 0) return;
        // yScale
        //     .domain(currentData.map(d => d.name).reverse())
        //     .range([innerHeight, 0]);
        // x轴范围
        // 如果所有数字很大导致拉不开差距

        if (big_value) {
            xScale
                .domain([
                    2 * d3.min(currentData, xValue) - d3.max(currentData, xValue),
                    d3.max(currentData, xValue) + 10
                ])
                .range([0, innerWidth]);
        } else {
            xScale
                .domain([0, d3.max(currentData, xValue) + 1])
                .range([0, innerWidth]);
        }
        if (auto_sort) {
            dateLabel
                .data(currentData)
                .transition()
                .duration(baseTime * interval_time)
                .ease(d3.easeLinear)
                .tween("text", function (d) {
                    var self = this;
                    var i = d3.interpolateDate(
                        new Date(self.textContent),
                        new Date(d.date)
                    );
                    // var prec = (new Date(d.date) + "").split(".");
                    // var round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                    return function (t) {
                        var dateformat = d3.timeFormat(timeFormat);
                        self.textContent = dateformat(i(t));
                    };
                });
        } else {
            dateLabel.text(currentdate);
        }

        xAxisG
            .transition()
            .duration(baseTime * interval_time)
            .ease(d3.easeLinear)
            .call(xAxis);
        yAxisG
            .transition()
            .duration(baseTime * interval_time)
            .ease(d3.easeLinear)
            .call(yAxis);

        yAxisG.selectAll(".tick").remove();
        if (!dataVisualConfig.show_x_tick) {
            xAxisG.selectAll(".tick").remove();
        }

        yScale
            .domain(currentData.map(d => d.name).reverse())
            .range([innerHeight, 0]);

        var bar = g.selectAll(".bar").data(currentData, function (d) {
            return d.name;
        });

        if (showMessage) {
            // 榜首文字
            topLabel.data(currentData).text(function (d) {
                if (lastname == d.name) {
                    counter.value = counter.value + step;
                } else {
                    counter.value = 1;
                }
                lastname = d.name;
                if (d.name.length > 24) return d.name.slice(0, 23) + "...";
                return d.name;
            });
            if (use_counter == true) {
                // 榜首持续时间更新
                days
                    .data(currentData)
                    .transition()
                    .duration(baseTime * interval_time)
                    .ease(d3.easeLinear)
                    .tween("text", function (d) {
                        var self = this;
                        var i = d3.interpolate(self.textContent, counter.value),
                            prec = (counter.value + "").split("."),
                            round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;

                        return function (t) {
                            self.textContent = d3.format(format)(
                                Math.round(i(t) * round) / round
                            );
                        };
                    });
            } else if (use_type_info == true) {
                // 榜首type更新
                top_type.data(currentData).text(function (d) {
                    return d["type"];
                });
            }
        }

        var barEnter = bar
            .enter()
            .insert("g", ".axis")
            .attr("class", "bar")
            .attr("transform", function (d) {
                return "translate(0," + yScale(yValue(d)) + ")";
            });

        barEnter
            .append("rect")
            .attr("width", function (d) {
                if (enter_from_0) {
                    return 0;
                } else {
                    return xScale(currentData[currentData.length - 1].value);
                }
            })
            .attr("fill-opacity", 0)
            .attr("height", 28)
            .attr("y", 50)
            .style("fill", d => getColor(d))
            .transition("a")
            .delay(500 * interval_time)
            .duration(2490 * interval_time)
            .attr("y", 0)
            .attr("width", d => xScale(xValue(d)))
            .attr("fill-opacity", 1);

        if (dataVisualConfig.rounded_rectangle) {
            d3.selectAll("rect").attr("rx", 14);
        }
        if (dataVisualConfig.showLabel == true) {
            barEnter
                .append("text")
                .attr("y", 50)
                .attr("fill-opacity", 0)
                .style("fill", d => getColor(d))
                .transition("2")
                .delay(500 * interval_time)
                .duration(2490 * interval_time)
                .attr("fill-opacity", 1)
                .attr("y", 0)
                .attr("class", function (d) {
                    return "label ";
                })
                .attr("x", dataVisualConfig.labelx)
                .attr("y", 20)
                .attr("text-anchor", "end")
                .text(d => offoset + d.key);
        }

        if (dataVisualConfig.use_img) {
            barEnter
                .append("defs")
                .append("pattern")
                .attr("id", d => d.name)
                .attr("width", "100%")
                .attr("height", "100%")
                .append("image")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", "40")
                .attr("height", "40")
                .attr("href", d => dataVisualConfig.imgs[d.name]);

            barEnter
                .append("circle")
                .attr("fill-opacity", 0)
                .attr("cy", 63)
                .attr(
                    "fill",
                    d =>
                        "url(#" +
                        encodeURIComponent(d.name)
                            .replace("'", "%27")
                            .replace("(", "%28")
                            .replace(")", "%29") +
                        ")"
                )
                .attr("stroke-width", "0px")
                .transition("a")
                .delay(500 * interval_time)
                .duration(2490 * interval_time)
                // .attr("stroke", d => getColor(d))
                // .attr("paint-order", "stroke")
                .attr("x", -16)
                .attr("cx", d => xScale(xValue(d)) - 20)
                .attr("cy", 13)
                .attr("r", 40 / 2)
                .attr("fill-opacity", 1);
        }
        // bar上文字
        var barInfo = barEnter
            .append("text")
            .attr("x", function (d) {
                if (long) return 10;
                if (enter_from_0) {
                    return 0;
                } else {
                    return xScale(currentData[currentData.length - 1].value);
                }
            })
            .attr("stroke", d => getColor(d))
            .attr("class", function () {
                return "barInfo";
            })
            .attr("y", 50)
            .attr("stroke-width", "0px")
            .attr("fill-opacity", 0)
            .transition()
            .delay(500 * interval_time)
            .duration(2490 * interval_time)
            .text(function (d) {
                if (d.show) {
                    return d.show.slice(0, dataVisualConfig.bar_name_max - 1) + ((d.show.length > dataVisualConfig.bar_name_max) ? "..." : "");
                } else {
                    return d.name.slice(0, dataVisualConfig.bar_name_max - 1) + ((d.name.length > dataVisualConfig.bar_name_max) ? "..." : "");
                }
            })
            .attr("x", d => {
                if (long) return 10;
                return xScale(xValue(d)) - 20;
            })
            .attr("fill-opacity", function (d) {
                if (xScale(xValue(d)) - 40 < display_barInfo) {
                    return 0;
                }
                return 1;
            })
            .attr("y", 2)
            .attr("dy", "16")
            .attr("text-anchor", function () {
                if (long) return "start";
                return "end";
            })
            .attr("stroke-width", function (d) {
                if (xScale(xValue(d)) - 40 < display_barInfo) {
                    return "0px";
                }
                return "4px";
            })
            .attr("paint-order", "stroke");
        if (long) {
            barInfo.tween("text", function (d) {
                var self = this;
                self.textContent = d.value;
                var i = d3.interpolate(self.textContent, Number(d.value)),
                    prec = (Number(d.value) + "").split("."),
                    round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
                return function (t) {
                    self.textContent =
                        d[divide_by] +
                        "-" +
                        d.name +
                        "  数值:" +
                        d3.format(format)(Math.round(i(t) * round) / round);
                };
            });
        }
        if (!long) {
            barEnter
                .append("text")
                .attr("x", function () {
                    if (long) {
                        return 10;
                    }
                    if (enter_from_0) {
                        return 0;
                    } else {
                        return xScale(currentData[currentData.length - 1].value);
                    }
                })
                .attr("y", 50)
                .attr("fill-opacity", 0)
                .style("fill", d => getColor(d))
                .transition()
                .duration(2990 * interval_time)
                .tween("text", function (d) {
                    var self = this;
                    // 初始值为d.value的0.9倍
                    self.textContent = d.value * 0.9;
                    var i = d3.interpolate(self.textContent, Number(d.value)),
                        prec = (Number(d.value) + "").split("."),
                        round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
                    // d.value = self.textContent
                    return function (t) {
                        self.textContent =
                            d3.format(format)(Math.round(i(t) * round) / round) +
                            dataVisualConfig.postfix;
                        // d.value = self.textContent
                    };
                })
                .attr("fill-opacity", 1)
                .attr("y", 0)
                .attr("class", function (d) {
                    return "value";
                })
                .attr("x", d => {
                    return xScale(xValue(d)) + 10;
                })
                .attr("y", 22);
        }
        var barUpdate = bar
            .transition("2")
            .duration(2990 * interval_time)
            .ease(d3.easeLinear);

        barUpdate
            .select("rect")
            .style("fill", d => getColor(d))
            .attr("width", d => xScale(xValue(d)));
        if (dataVisualConfig.showLabel == true) {
            barUpdate
                .select(".label")
                .attr("class", function (d) {
                    return "label ";
                })
                .style("fill", d => getColor(d))
                .attr("width", d => xScale(xValue(d)))
                .text(d => offoset + d.key);
        }

        if (!long) {
            barUpdate
                .select(".value")
                .attr("class", function (d) {
                    return "value";
                })
                .style("fill", d => getColor(d))
                .attr("width", d => xScale(xValue(d)));
        }
        barUpdate.select(".barInfo").attr("stroke", function (d) {
            return getColor(d);
        });

        if (dataVisualConfig.use_img) {
            barUpdate
                .select("circle")
                .attr("stroke", function (d) {
                    return getColor(d);
                })
                .attr("cx", d => xScale(xValue(d)) - 20);
        }

        var barInfo = barUpdate
            .select(".barInfo")
            .text(function (d) {
                if (d.show) {
                    return d.show.slice(0, dataVisualConfig.bar_name_max - 1) + ((d.show.length > dataVisualConfig.bar_name_max) ? "..." : "");
                } else {
                    return d.name.slice(0, dataVisualConfig.bar_name_max - 1) + ((d.name.length > dataVisualConfig.bar_name_max) ? "..." : "");
                }
            })
            .attr("x", d => {
                if (long) return 10;
                return xScale(xValue(d)) - 20;
            })
            .attr("fill-opacity", function (d) {
                if (xScale(xValue(d)) - 40 < display_barInfo) {
                    return 0;
                }
                return 1;
            })
            .attr("stroke-width", function (d) {
                if (xScale(xValue(d)) - 40 < display_barInfo) {
                    return "0px";
                }
                return "4px";
            })
            .attr("paint-order", "stroke");

        if (long) {
            barInfo.tween("text", function (d) {
                var self = this;
                var str = d[divide_by] + "-" + d.name + "  数值:";

                var i = d3.interpolate(
                    self.textContent.slice(str.length, 99),
                    Number(d.value)
                ),
                    prec = (Number(d.value) + "").split("."),
                    round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
                return function (t) {
                    self.textContent =
                        d[divide_by] +
                        "-" +
                        d.name +
                        "  数值:" +
                        d3.format(format)(Math.round(i(t) * round) / round);
                };
            });
        }
        if (!long) {
            barUpdate
                .select(".value")
                .tween("text", function (d) {
                    var self = this;

                    // if postfix is blank, do not slice.
                    if (dataVisualConfig.postfix == "") {
                        var i = d3.interpolate(self.textContent, Number(d.value));
                    } else {
                        var i = d3.interpolate(
                            self.textContent.slice(0, -dataVisualConfig.postfix.length),
                            Number(d.value)
                        );
                    }

                    var i = d3.interpolate(
                        deformat(self.textContent, dataVisualConfig.postfix),
                        Number(d.value)
                    );

                    var prec = (Number(d.value) + "").split("."),
                        round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
                    // d.value = self.textContent
                    return function (t) {
                        self.textContent =
                            d3.format(format)(Math.round(i(t) * round) / round) +
                            dataVisualConfig.postfix;
                        // d.value = self.textContent
                    };
                })
                .duration(2990 * interval_time)
                .attr("x", d => xScale(xValue(d)) + 10);
        }
        avg =
            (Number(currentData[0]["value"]) +
                Number(currentData[currentData.length - 1]["value"])) /
            2;

        var barExit = bar
            .exit()
            .attr("fill-opacity", 1)
            .transition()
            .duration(2500 * interval_time);
        barExit
            .attr("transform", function (d) {
                if (always_up) {
                    return "translate(0," + "-100" + ")";
                }
                if (Number(d.value) > avg && allow_up) {
                    return "translate(0," + "-100" + ")";
                }
                return "translate(0," + "1000" + ")";
            })
            .remove()
            .attr("fill-opacity", 0);
        barExit
            .select("rect")
            .attr("fill-opacity", 0)
            .attr("width", () => {
                if (always_up) return xScale(0);
                return xScale(currentData[currentData.length - 1]["value"]);
            });
        if (!long) {
            barExit
                .select(".value")
                .attr("fill-opacity", 0)
                .attr("x", () => {
                    if (always_up) return xScale(0);
                    return xScale(currentData[currentData.length - 1]["value"]);
                });
        }
        barExit
            .select(".barInfo")
            .attr("fill-opacity", 0)
            .attr("stroke-width", function (d) {
                return "0px";
            })
            .attr("x", () => {
                if (long) return 10;
                if (always_up) return xScale(0);
                return xScale(currentData[currentData.length - 1]["value"]);
            });
        barExit.select(".label").attr("fill-opacity", 0);
        if (dataVisualConfig.use_img) {
            barExit.select("circle").attr("fill-opacity", 0);
        }
    }

    function change() {
        yScale
            .domain(currentData.map(d => d.name).reverse())
            .range([innerHeight, 0]);
        if (animation == "linear") {
            g.selectAll(".bar")
                .data(currentData, function (d) {
                    return d.name;
                })
                .transition("1")
                .ease(d3.easeLinear)
                .duration(baseTime * update_rate * interval_time)
                .attr("transform", function (d) {
                    return "translate(0," + yScale(yValue(d)) + ")";
                });
        } else {
            g.selectAll(".bar")
                .data(currentData, function (d) {
                    return d.name;
                })
                .transition("1")
                .duration(baseTime * update_rate * interval_time)
                .attr("transform", function (d) {
                    return "translate(0," + yScale(yValue(d)) + ")";
                });
        }
    }

    var i = 0;
    var p = dataVisualConfig.wait;
    var update_rate = dataVisualConfig.update_rate;
    var inter = setInterval(function next() {
        // 空过p回合
        while (p) {
            p -= 1;
            return;
        }
        currentdate = time[i];
        getCurrentData(time[i]);
        i++;

        if (i >= time.length) {
            window.clearInterval(inter);
            setTimeout(() => {
                callback()
            }, 5000);
        }
    }, baseTime * interval_time);
    // setInterval(() => {
    //     d3.transition()
    //         .each(change)
    // }, baseTime * update_rate * interval_time)
}
