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
        .entries(dataset);

      // console.log(nested);

      // function addEmpties(data, timeExtent) {}

      const xExtent = d3.extent(dataset, d => parseTime(d.date));

      const yExtent = [
        d3.min(nested, d => {
          return d3.min(d.values, v => v.value.weight);
        }),
        d3.max(nested, d => {
          return d3.max(d.values, v => v.value.weight);
        })
      ];

      const xScale = d3
        .scaleTime()
        .domain(xExtent)
        .range([0, width]);
      // const xAxis = d3.axisBottom(xScale).tickFormat(formatTime);

      const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([height / 20 - 5, 0]);

      // console.log(nested);

      const areaCalc = d3
        .area()
        .x(d => xScale(new Date(d.key)))
        .y1(d => yScale(d.value.weight))
        .y0(yScale(0));

      function formatZeroValues(nestedData, dateExtent) {
        function dateCompare(date1, date2) {
          return (
            date1.getFullYear() === date2.getFullYear() &&
            // getMonth is 0-indexed
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() == date2.getDate()
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
        console.log(formattedData);

        return formattedData;
      }

      return formatZeroValues(nested, xExtent).map((genre, index) => {
        return (
          <g
            key={genre.key}
            className="genre-group"
            transform={`translate(${0}, ${index * (height / 20)})`}
          >
            <text
              x={margin.left - 10}
              y={height / 20 - 5}
              className="genre-label"
            >
              {genre.key}
            </text>
            <g transform={`translate(${margin.left}, 0)`}>
              <path className="genre-bar" d={areaCalc(genre.values)} />
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
