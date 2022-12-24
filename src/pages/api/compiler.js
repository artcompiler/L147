/* Copyright (c) 2019, Art Compiler LLC */
import {
  assert,
  message,
  messages,
  reserveCodeRange,
  decodeID,
  encodeID,
  validate,
} from "./share.js"

reserveCodeRange(1000, 1999, "compile");
messages[1001] = "Node ID %1 not found in pool.";
messages[1002] = "Invalid tag in node with Node ID %1.";
messages[1003] = "No async callback provided.";
messages[1004] = "No visitor method defined for '%1'.";

const transform = (function() {
  const table = {
    "X-TICK-FORMAT": xTickFormat,
    "Y-TICK-FORMAT": yTickFormat,
    "Y-TICK-SIZE": yTickSize,
    "X-AXIS-LABEL": xAxisLabel,
    "Y-AXIS-LABEL": yAxisLabel,
    "CHART-PADDING": chartPadding,
    "GAP": gap,
    "HORIZONTAL": horizontal,
    "HIDE-AXIS": hideAxis,
    "HIDE-X-AXIS": hideXAxis,
    "HIDE-Y-AXIS": hideYAxis,
    "HIDE-LEGEND": hideLegend,
    "HIDE-GRID": hideGrid,
    "HIDE-X-GRID": hideXGrid,
    "HIDE-Y-GRID": hideYGrid,
    "SHOW-Y-VALUES": showYValues,
    "STACK": stack,
    "DOT-RADIUS": dotRadius,
    "PALETTE": palette,
    "RGB": rgb,
    "ROWS": rows,
    "COLS": cols,
    "BAR-WIDTH": barWidth,
    "WIDTH": width,
    "HEIGHT": height,
    "LINE-WIDTH": lineWidth,
    "LINE-COLORS": colors,
    "COLORS": colors,
    "TABLE-CHART": tableChart,
    "BAR-CHART": barChart,
    "TIMESERIES-CHART": timeseriesChart,
    "AREA-CHART": areaChart,
    "HEATMAP": heatmap,
    "PROG" : program,
    "EXPRS" : exprs,
    "STR": str,
    "NUM": num,
    "IDENT": ident,
    "BOOL": bool,
    "LIST": list,
    "RECORD": record,
    "BINDING": binding,
    "ADD" : add,
    "MUL" : mul,
    "VAL" : val,
    "KEY" : key,
    "LEN" : len,
    "STYLE" : style,
    "CONCAT" : concat,
    "ARG" : arg,
    "DEFAULTS" : defaults,
    "IN" : defaults,
    "LAMBDA" : lambda,
    "PAREN" : paren,
    "APPLY" : apply,
    "MAP" : map,
  };
  let nodePool;
  let version;
  function getVersion(pool) {
    return pool.version ? +pool.version : 0;
  }
  function transform(code, data, resume) {
    nodePool = code;
    version = getVersion(code);
    return visit(code.root, data, resume);
  }
  function error(str, nid) {
    return {
      str: str,
      nid: nid,
    };
  }
  function visit(nid, options, resume) {
    assert(typeof resume === "function", message(1003));
    // Get the node from the pool of nodes.
    let node;
    if (typeof nid === "object") {
      node = nid;
    } else {
      node = nodePool[nid];
    }
    assert(node, message(1001, [nid]));
    assert(node.tag, message(1001, [nid]));
    assert(typeof table[node.tag] === "function", message(1004, [JSON.stringify(node.tag)]));
    return table[node.tag](node, options, resume);
  }
  // BEGIN VISITOR METHODS
  function tableChart(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      let vals = val0;
      resume([].concat(err0), {
        type: "table-chart",
        args: {
          vals: vals,
        }
      });
    });
  };
  function barChart(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      let vals = val0;
      resume([].concat(err0), {
        type: "bar-chart",
        args: {
          vals: vals,
        }
      });
    });
  };
  function timeseriesChart(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        let cols = val0;
        let vals = val1;
        resume([].concat(err0).concat(err1), {
          type: "timeseries-chart",
          args: {
            cols: cols,
            vals: vals,
          }
        });
      });
    });
  };
  function areaChart(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      let vals = [];
      let keys = Object.keys(val0[0]);
      vals.push(keys);
      val0.forEach((v, i) => {
        if (+v[keys[1]] < 120) {
          vals.push([
            v[keys[0]],
            v[keys[1]],
          ]);
        }
      });
      resume([].concat(err0), {
        type: "area-chart",
        args: {
          vals: vals,
        }
      });
    });
  };
  function heatmap(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      // let vals = [];
      // let keys = Object.keys(val0[0]);
      // vals.push(keys);
      // val0.forEach((v, i) => {
      //   if (+v[keys[1]] < 120) {
      //     vals.push([
      //       v[keys[0]],
      //       v[keys[1]],
      //     ]);
      //   }
      // });
      resume([].concat(err0), {
        type: "heatmap",
        args: {
          vals: val0,
        }
      });
    });
  };
  function horizontal(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.horizontal = true;
      resume([].concat(err0), val0);
    });
  };
  function hideAxis(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.hideXAxis = true;
      val0.hideYAxis = true;
      resume([].concat(err0), val0);
    });
  };
  function hideXAxis(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.hideXAxis = true;
      resume([].concat(err0), val0);
    });
  };
  function hideYAxis(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.hideYAxis = true;
      resume([].concat(err0), val0);
    });
  };
  function hideLegend(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.hideLegend = true;
      resume([].concat(err0), val0);
    });
  };
  function hideGrid(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.hideXGrid = true;
      val0.hideYGrid = true;
      resume([].concat(err0), val0);
    });
  };
  function hideXGrid(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.hideXGrid = true;
      resume([].concat(err0), val0);
    });
  };
  function hideYGrid(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.hideYGrid = true;
      resume([].concat(err0), val0);
    });
  };
  function showYValues(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.showYValues = true;
      resume([].concat(err0), val0);
    });
  };
  function horizontal(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.horizontal = true;
      resume([].concat(err0), val0);
    });
  };
  function stack(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      val0.stack = true;
      resume([].concat(err0), val0);
    });
  };
  function dotRadius(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.dotRadius = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function palette(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.palette = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  }
  function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
  }
  function rgb(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      console.log("rgb() val0=" + JSON.stringify(val0));
      let r = decimalToHex(val0[0], 2);
      let g = decimalToHex(val0[1], 2);
      let b = decimalToHex(val0[2], 2);
      let val = "#" + r + g + b;
      resume([].concat(err0), val);
    });
  }
  function rowLabels(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.rowLabels = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function rows(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        let rows = val1.rows = val0[0];
        let vals = val1.args.vals;
        let name = rows.name;
        let type = "none";
        let newVals = [];
        vals.forEach(v => {
          newVals.push(Object.assign({}, v, {
            row: v[name],
            label: v[name],
            val: v.value, //scale(v.value, val1.rows),
            tip: v.value + (rows.units && " " + rows.units || ""),
          }));
        });
        val1.args.vals = newVals;
        resume([].concat(err0).concat(err1), val1);
        // val1.rows = val0;
        // let vals = val1.args.vals;
        // let rows = val1.rows;
        // let newVals = []
        // vals.forEach(v => {
        //   rows.forEach((r, i) => {
        //     let name = r.name;
        //     newVals.push(Object.assign({}, v, {
        //       row: i,un
        //       val: scale(v[name], r),
        //       tip: v[name] + (r.units && " " + r.units || ""),
        //     }));
        //   });
        // });
        // val1.args.vals = newVals;
        // resume([].concat(err0).concat(err1), val1);
      });
    });
    function scale(v, r) {
      let [NONE, NORMAL, WARNING, CRITICAL] = [0, 1, 2, 3];
      if (r.normal) {
        let breaks = r.normal;
        for (let i = 0; i < breaks.length; i += 2) {
          if (v >= breaks[i] && v < breaks[i + 1]) {
            return NORMAL;
          }
        }
      }
      if (r.warning) {
        let breaks = r.warning;
        for (let i = 0; i < breaks.length; i += 2) {
          if (v >= breaks[i] && v < breaks[i + 1]) {
            return WARNING;
          }
        }
      }
      if (r.critical) {
        let breaks = r.critical;
        for (let i = 0; i < breaks.length; i += 2) {
          if (v >= breaks[i] && v < breaks[i + 1]) {
            return CRITICAL;
          }
        }
      }
      return NONE;
    }
  };
  function cols(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.cols = val0[0];
        let vals = val1.args.vals;
        let name = val1.cols.name;
        let type = "time"
        let interval = val1.cols.interval;
        vals.forEach(v => {
          switch (type) {
          case "time":
            let t = new Date(v[name]);
            switch (interval) {
            case "day":
              v.col = t.getDate() - 1;
              break;
            case "hour":
              v.col = t.getHours();
              break;
            case "minute":
              v.col = t.getMinutes();
              break;
            }
            break;
          default:
            break;
          }
        });
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function xAxisLabel(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.xAxisLabel = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function yAxisLabel(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.yAxisLabel = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function xTickFormat(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.xTickFormat = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function yTickFormat(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.yTickFormat = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function yTickSize(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.yTickSize = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function chartPadding(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.chartPadding = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function gap(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.gap = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function barWidth(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.barWidth = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function width(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.width = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function height(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.height = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function lineWidth(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.lineWidth = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function colors(node, options, resume) {
    visit(node.elts[0], options, function (err0, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        val1.colors = val0;
        resume([].concat(err0).concat(err1), val1);
      });
    });
  };
  function str(node, options, resume) {
    let val = node.elts[0];
    resume([], val);
  }
  function num(node, options, resume) {
    let val = node.elts[0];
    resume([], +val);
  }
  function ident(node, options, resume) {
    let val = node.elts[0];
    resume([], val);
  }
  function bool(node, options, resume) {
    let val = node.elts[0];
    resume([], !!val);
  }
  function concat(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      let str = "";
      if (val1 instanceof Array) {
        val1.forEach(v => {
          str += v;
        });
      } else {
        str = val1.toString();
      }
      resume(err1, str);
    });
  }
  function paren(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(err1, val1);
    });
  }
  function list(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node = {
          tag: "LIST",
          elts: node.elts.slice(1),
        };
        list(node, options, function (err2, val2) {
          let val = [].concat(val2);
          val.unshift(val1);
          resume([].concat(err1).concat(err2), val);
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        let val = [val1];
        resume([].concat(err1), val);
      });
    } else {
      resume([], []);
    }
  }
  function defaults(node, options, resume) {
    // If there is input data, then use it, otherwise use default data.
    if (node.elts.length === 0) {
      // No args, so use the given data or empty.
      let data = options.data ? options.data : [];
      resume([], data);
    } else {
      visit(node.elts[0], options, function (err1, val1) {
        if (false) {
          err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
        }
        let data = options.data && Object.keys(options.data).length != 0 ? options.data : val1;
        resume([].concat(err1), data);
      });
    }
  }
  function arg(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      let key = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      resume([].concat(err1), options.args[key]);
    });
  }
  function args(node, options, resume) {
    resume([], options.args);
  }
  function lambda(node, options, resume) {
    // Return a function value.
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function apply(node, options, resume) {
    // Apply a function to arguments.
    visit(node.elts[1], options, function (err1, val1) {
      // args
      options.args = [val1];
      visit(node.elts[0], options, function (err0, val0) {
        // fn
        resume([].concat(err1).concat(err0), val0);
      });
    });
  }
  function map(node, options, resume) {
    // Apply a function to arguments.
    visit(node.elts[1], options, function (err1, val1) {
      // args
      let errs = [];
      let vals = [];
      val1.forEach((val) => {
        options.args = [val];
        visit(node.elts[0], options, function (err0, val0) {
          vals.push(val0);
          errs = errs.concat(err0);
        });
      });
      resume(errs, vals);
    });
  }
  function binding(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), {key: val1, val: val2});
      });
    });
  }
  function record(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node = {
          tag: "RECORD",
          elts: node.elts.slice(1),
        };
        record(node, options, function (err2, val2) {
          val2[val1.key] = val1.val;
          resume([].concat(err1).concat(err2), val2);
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        let val = {};
        val[val1.key] = val1.val;
        resume([].concat(err1), val);
      });
    } else {
      resume([], {});
    }
  }
  function exprs(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node = {
          tag: "EXPRS",
          elts: node.elts.slice(1),
        };
        exprs(node, options, function (err2, val2) {
          let val = [].concat(val2);
          val.unshift(val1);
          resume([].concat(err1).concat(err2), val);
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        let val = [val1];
        resume([].concat(err1), val);
      });
    } else {
      resume([], []);
    }
  }
  function program(node, options, resume) {
    if (!options) {
      options = {};
    }
    visit(node.elts[0], options, function (err, val) {
      // Return the value of the last expression.
      resume(err, val.pop());
    });
  }
  function key(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      let key = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        let obj = val2;
        if (false) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), Object.keys(obj)[key]);
      });
    });
  }
  function val(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      let key = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        let obj = val2;
        if (false) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), obj[key]);
      });
    });
  }
  function len(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      let obj = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      resume([].concat(err1), obj.length);
    });
  }
  function add(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      val1 = +val1;
      if (isNaN(val1)) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        val2 = +val2;
        if (isNaN(val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), val1 + val2);
      });
    });
  }
  function mul(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      val1 = +val1;
      if (isNaN(val1)) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        val2 = +val2;
        if (isNaN(val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), val1 * val2);
      });
    });
  }
  function style(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        val2.style = val1
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  return transform;
})();
let render = (function() {
  function escapeXML(str) {
    return String(str)
      .replace(/&(?!\w+;)/g, "&amp;")
      .replace(/\n/g, " ")
      .replace(/\\/g, "\\\\")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function render(val, options, resume) {
    // Do some rendering here.
    resume([], val);
  }
  return render;
})();

export const compiler = {
  langID: '147',
  compile(code, data, config, resume) {
    try {
      let options = {
        data: data
      };
      transform(code, options, function (err, val) {
        if (err.length) {
          resume(err, val);
        } else {
          render(val, options, function (err, val) {
            resume(err, val);
          });
        }
      });
    } catch (x) {
      console.log("ERROR with code");
      console.log(x.stack);
      resume(["Compiler error"], {
        score: 0
      });
    }
  }
};
