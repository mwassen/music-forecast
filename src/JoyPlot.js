import React, { Component } from "react";
import * as d3 from "d3";
import "./JoyPlot.css";

// JoyPlot inspired by https://bl.ocks.org/armollica/3b5f83836c1de5cca7b1d35409a013e3
class JoyPlot extends Component {
  render() {
    const margin = {
      top: 30,
      right: 100,
      bottom: 30,
      left: 150
    };
    const width = 700 - margin.left - margin.right;
    const height = 2000 - margin.top - margin.bottom;

    function dataPrep(dataset) {
      // Set overlap between charts (percent)
      // const overlap = 0.6;

      // Parse API time and format for chart
      const parseTime = d3.timeParse("%Y-%m-%d");
      // const formatTime = d3.timeFormat("%Y-%m-%d");

      // Nest data according to genre and dates
      const nested = d3
        .nest()
        .key(d => d.genre)
        .key(d => parseTime(d.date))
        .rollup(v => {
          return {
            weight: d3.sum(v, d => d.weight),
            details: v
              .map(date => {
                return date.details;
              })
              .filter((thing, index, self) => {
                // Object duplicate filter found at https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript#comment72641733_36744732
                return (
                  self.findIndex(
                    t => t.place === thing.place && t.name === thing.name
                  ) === index
                );
              })
          };
        })
        .entries(dataset)
        .sort((a, b) => {
          // Organise after genre cumulative weight
          return (
            d3.sum(b.values, d => d.value.weight) -
            d3.sum(a.values, d => d.value.weight)
          );
        });

      const xExtent = d3.extent(dataset, d => parseTime(d.date));

      function formatZeroValues(nestedData, dateExtent) {
        function dateCompare(date1, date2) {
          return (
            date1.getFullYear() === date2.getFullYear() &&
            // getMonth is 0-indexed
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
          );
        }

        const formattedData = [];

        nestedData.forEach(genre => {
          const newGenre = {
            key: genre.key,
            values: []
          };

          // console.log(dateExtent);

          for (
            let d = new Date(dateExtent[0]);
            d < dateExtent[1];
            d.setDate(d.getDate() + 1)
          ) {
            // console.log(d);
            let found = false;
            let curValue;
            genre.values.forEach(date => {
              const cur = new Date(date.key);

              if (dateCompare(d, cur)) {
                found = true;
                curValue = date;
              }
            });
            if (found) {
              newGenre.values.push(curValue);
            } else {
              newGenre.values.push({
                key: new Date(d),
                value: { weight: 0 }
              });
            }
          }

          formattedData.push(newGenre);
        });
        // console.log(formattedData);

        return formattedData;
      }

      const usableData = formatZeroValues(nested, xExtent);

      // Calculate yExtent from formatted values
      const yExtent = [
        d3.min(usableData, d => {
          return d3.min(d.values, v => v.value.weight);
        }),
        d3.max(usableData, d => {
          return d3.max(d.values, v => v.value.weight);
        })
      ];

      const xScale = d3
        .scaleTime()
        .domain(xExtent)
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([0, height / 40 - 5]);

      // This could be calculated from xExtent somehow....
      const rectCount = 500;

      usableData.forEach(genre => {
        genre.yScale = d3
          .scaleLinear()
          .domain(genre.values.map(d => xScale(new Date(d.key))))
          .range(genre.values.map(d => yScale(d.value.weight)));

        genre.xScale = d3
          .scaleBand()
          .domain(d3.range(rectCount))
          .paddingInner(0)
          .range([0, width]);
      });

      // console.log(usableData);

      function calcWaveRects(genre) {
        // console.log(genre);
        return d3.range(rectCount).map((rect, ind) => {
          const x = genre.xScale(rect);
          const width = genre.xScale.bandwidth();
          const y = genre.yScale(x);
          const height = y * 2;
          const id = genre.key + "-" + ind;

          // console.log(y);

          return {
            x,
            width,
            y,
            height,
            id
          };
        });
      }

      function drawWaveRects(rects) {
        return rects.map(rect => {
          const empty = rect.y <= 0;
          const noValue = 0.2;
          return (
            <g key={rect.id} className={empty ? "empty-bar" : "data-bar"}>
              <rect
                x={rect.x}
                y={rect.y <= 0 ? -noValue / 2 : -rect.y}
                width={rect.width}
                height={rect.height <= 0 ? noValue : rect.height}
              />
            </g>
          );
        });
      }

      // console.log(calcWaveRects(usableData[0]));

      return usableData.map((genre, index) => {
        return (
          <g
            key={genre.key}
            className="genre-group"
            transform={`translate(${0}, ${(index + 1) * (height / 20)})`}
          >
            <text x={margin.left - 10} y="2" className="genre-label">
              {genre.key}
            </text>
            <g transform={`translate(${margin.left}, 0)`}>
              {drawWaveRects(calcWaveRects(genre))}
            </g>
          </g>
        );
      });
    }

    return (
      <div>
        <svg
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        >
          <g>{dataPrep(this.props.dataSet)}</g>
        </svg>
      </div>
    );
  }
}

export default JoyPlot;
