import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as d3 from 'd3';

function AreaChart({formid, data}) {
  React.useEffect(() => {
    (async () => {
      if (!data || Object.keys(data).length === 0) {
        return;
      }
      const c3 = await import('c3');
      let cols = data.args.vals[0];
      let rows = data.args.vals;
      let vals = [];
      let colors = data.colors;
      let showXAxis = data.hideXAxis !== true;
      let showYAxis = data.hideYAxis !== true;
      let lineWidth = data.lineWidth;
      let dotRadius = data.dotRadius;
      let chartPadding = data.chartPadding;
      let [min, max] = getRange(rows.slice(1)); // Slice off labels.
      let pad = (max - min) / 4;
      rows = rebaseValues(pad - min, rows);  // val + pad - min
      let types = {}
      types[cols[cols.length - 1]] = "area";  // Use last column as values.
      let padding = {
        top: -5,
        right: -20,
        bottom: -7,
        left: -20,
      };
      if (chartPadding) {
        if (chartPadding instanceof Array) {
          padding = {
            top: padding.top + chartPadding[0],
            right: padding.right + chartPadding[1],
            bottom: padding.bottom + chartPadding[2],
            left: padding.left + chartPadding[3],
          }
        } // Otherwise, its undefine, scalar or object, which is fine.
      }
      var chart = c3.generate({
        bindto: '#graffiti',
        padding: padding,
        transition: {
          duration: 0
        },
        data: {
          rows: rows,
          types: types,
        },
        legend: {
          show: false,
        },
        axis: {
          x: {
            show: showXAxis,
            padding: {
              left: 1,
              right: 1,
            },
          },
          y: {
            show: showYAxis,
            padding: {
              left: 0,
              right: 0,
            }
          },
        },
        color: {
          pattern: colors,
        },
        size: {
          width: data.width,
          height: data.height,
        },
      });
      if (lineWidth) {
        d3.selectAll(".c3-line").style("stroke-width", lineWidth)
      }
      if (dotRadius) {
        d3.selectAll(".c3-circle").attr("r", dotRadius)
      }
    })();
  }, [data]);

  return <div id="graffiti" />;
}

function TableChart({ data }) {
  React.useEffect(() => {
    if (!data) {
      return;
    }
    let values = data.args.vals.slice(1); // Slice off labels.
    let style = data.style;
    let padding = data.chartPadding || 0;
    let width = data.width - 2 * padding || "100%";
    let height = data.height - 2 * padding || "100%";
    // render the table
    tabulate(values, ["Reward", "Count"]);
    if (style) {
      // Apply global styles.
      Object.keys(style).forEach(selector => {
        let styles = style[selector];
        Object.keys(styles).forEach(style => {
          let value = styles[style];
          d3.selectAll(selector).style(style, value);
        });
      });
    }
    
    // The table generation function
    function tabulate(data, columns) {
      var table = d3.select("#graffiti svg"),
          tbody = table.append("g").classed("y-values", true);
      table
        .attr("width", width + 2 * padding)
        .attr("height", height + 2 * padding);

      // create a row for each object in the data
      let count = data.length;
      let dy = height / count;
      let textSize = +style.tspan["font-size"] || 12;
      var rows = tbody.selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .attr("x", padding)
          .attr("y", (d, i) => {
            return padding + (i + 1) * dy - (dy - textSize) / 2 - 2;
          });

      var lines = tbody.selectAll("line")
          .data(data.slice(1))
          .enter()
          .append("line")
          .attr("x1", padding)
          .attr("y1", (d, i) => {
            return padding + (i + 1) * dy;
          })
          .attr("x2", width + padding)
          .attr("y2", (d, i) => {
            return padding + (i + 1) * dy;
          });
      // create a cell in each row for each column
      var cells = rows.selectAll("tspan")
          .data(function(row) {
            return columns.map(function(column, i) {
              return {column: i, value: row[i]};
            });
          })
          .enter()
          .append("tspan")
          .attr("text-anchor", (d, i) => {
            return d.column === 0 ? "start" : "end"
          })
          .attr("x", (d, i) => {
            return d.column === 0 ? padding : padding + width;
          })
          .html(function(d) {
            let text;
            if (!d.value) {
              text = String(d.value);
            } else if (d.value.length > 34) {
              let words = d.value.split(" ");
              text = "";
              for (let i = 0; text.length < 36; i++) {
                if (i) {
                  text += " ";
                }
                text += words[i];
              }
              // Now slice off the last word.
              text = text.slice(0, text.lastIndexOf(" ")) + "\u2026";
            } else {
              text = d.value;
            }
            return text;
          });
      return table;
    }
  }, [data]);
  return <div />;
}

const getRange = (vals, grouped, min, max) => {
  // min and max are seed values is given.
  // Assert all vals are numbers.
  vals.forEach(val => {
    if (val instanceof Array) {
      let [tmin, tmax] = getRange(val);
      if (grouped) {
        // Stacked so just add them together.
        tmin = tmax = tmin + tmax;
      }
      if (!isNaN(tmin) && min === undefined || tmin < min) {
        min = tmin;
      }
      if (!isNaN(tmax) && max === undefined || tmax > max) {
        max = tmax;
      }
    } else {
      val = +val;
      if (!isNaN(val) && min === undefined || val < min) {
        min = val;
      }
      if (!isNaN(val) && max === undefined || val > max) {
        max = val;
      }
    }
  });
  return [min, max];
};

const rebaseValues = (offset, vals) => {
  let rebasedVals = [];
  vals.forEach((val, i) => {
    if (i === 0) {
      rebasedVals.push(val);  // Column name, so don't rebase.
    } else if (val instanceof Array) {
      rebasedVals.push(rebaseValues(offset, val));
    } else if (!isNaN(+val)) {
      rebasedVals.push(+val + offset);
    } else {
      rebasedVals.push(val);  // Not a number so return as is.
    }
  });
  return rebasedVals;
};

function render(nodes) {
  console.log("render() nodes=" + JSON.stringify(nodes, null, 2));
  let elts = [];
  nodes = [].concat(nodes);
  let key = 1;
  nodes.forEach(function (n, i) {
    let args = [];
    if (n.args) {
      args = render(n.args);
    }
    switch (n.type) {
    case "table-chart":
      elts.push(
        <TableChart key={key++} data={n} style={n.style} {...n}/>
      );
      break;
    case "area-chart":
      elts.push(
        <div key={key++} id="chart">
          <AreaChart data={n} style={n.style} {...n}/>
        </div>
      );
      break;
    case "str":
      elts.push(<span className="u-full-width" key={key++} style={n.style}>{""+n.value}</span>);
      break;
    default:
      break;
    }
  });
  return elts;
}

const initData = {
  "type": "table-chart",
  "args": {
    "vals": [
      [
        "Description",
        "Count"
      ],
      [
        "Buy any coffee beverage and get one free!",
        "362"
      ],
      [
        "Free 12 oz Coffee beverage",
        "309"
      ],
      [
        "Free 8 oz Coffee beverage",
        "186"
      ],
      [
        "Free 16 oz Coffee beverage",
        "132"
      ],
      [
        "Buy any coffee beverage and get one for 50 off!",
        "55"
      ]
    ]
  },
  "chartPadding": 10,
  "height": 148,
  "width": 265,
  "style": {
    "tspan": {
      "font-size": 12,
      "fill": "#595959"
    },
    "line": {
      "stroke": "#DEDEDE"
    }
  }
};

const Form = () => {
  const [elts, setElts] = useState([]);
  const router = useRouter();
  const { type, data } = router.query;
  useEffect(() => {
    if (data === undefined) {
      return;
    }
    const { url } = JSON.parse(data);
    (async () => {
      const resp = await fetch(
        url,
        { headers: {'Content-Type': 'application/json'}}
      );
      const { data } = await resp.json();
      if (data === undefined) {
        return;
      }
      try {
        setElts(render(data));
      } catch (x) {
        // Bad data.
        console.log("Bad data in query: " + x);
      }
    })();
  }, [data]);
  return (
    <div id="graffiti"  className="c3"> <svg> {elts} </svg> </div>
  );
}

export default Form;
