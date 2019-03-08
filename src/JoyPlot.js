import React from "react";
import * as d3 from "d3";
import "./JoyPlot.css";
import { Trail, animated } from "react-spring/renderprops";

class JoyPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dimensions: {},
      rectCount: null,
      xScale: null
    };
    this.xAxisRef = React.createRef();
    this.brushRef = React.createRef();
    // this.genreGraphs = this.genreGraphs.bind(this);
    this.renderAxes = this.renderAxes.bind(this);
  }

  componentDidMount() {
    this.renderAxes();

    this.state.data.forEach((point, ind) => {
      const topLeft = [
        this.state.dimensions.margin.left,
        this.state.dimensions.margin.top +
          ind * (this.state.dimensions.height / 20) +
          18
      ];
      const bottomRight = [
        this.state.dimensions.width + this.state.dimensions.margin.left,
        this.state.dimensions.margin.top +
          (ind + 1) * (this.state.dimensions.height / 20) +
          18
      ];

      const currentBrush = d3
        .select(this.brushRef.current)
        .append("g")
        .attr("id", point.key + "-brush")
        .attr("class", "genre-brush");

      const genreBrush = d3
        .brushX()
        .extent([
          topLeft, // Top left
          bottomRight // Bottom right
        ])
        .on("end", () => {
          const [minX, maxX] = d3.event.selection;
          const range = [
            this.state.xScale.invert(minX - this.state.dimensions.margin.left),
            this.state.xScale.invert(maxX - this.state.dimensions.margin.left)
          ];
          const events = [];

          point.values.forEach(date => {
            if (date.value.weight !== 0) {
              const curDate = new Date(date.key);
              if (curDate >= range[0] && curDate <= range[1]) {
                const hitConcerts = date.value.details;
                hitConcerts.forEach(hit => {
                  events.push(hit);
                });
              }
            }
          });

          console.log(events);
        });

      currentBrush.call(genreBrush);
    });
  }

  componentDidUpdate() {
    this.renderAxes();
  }

  renderAxes() {
    const xAxis = d3.axisTop();
    // const intervals = [window.innerWidth / 150];
    // // const yAxis = d3.axisLeft();

    // xAxis.tickArguments(intervals);

    xAxis.scale(this.state.xScale);
    d3.select(this.xAxisRef.current).call(xAxis);
  }

  static getDerivedStateFromProps(nextProps) {
    const { dataSet } = nextProps;
    if (!dataSet) return {};

    const margin = {
      top: 30,
      right: window.innerWidth / 20,
      bottom: 30,
      left: window.innerWidth / 20 > 100 ? window.innerWidth : 100
    };
    const width =
      window.innerWidth - window.innerWidth / 20 - margin.left - margin.right;
    const height = 2000 - margin.top - margin.bottom;

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
      .entries(dataSet)
      .sort((a, b) => {
        // Organise after genre cumulative weight
        return (
          d3.sum(b.values, d => d.value.weight) -
          d3.sum(a.values, d => d.value.weight)
        );
      });

    const xExtent = d3.extent(dataSet, d => parseTime(d.date));

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
    // const yExtent = [
    //   d3.min(usableData, d => {
    //     return d3.min(d.values, v => v.value.weight);
    //   }),
    //   d3.max(usableData, d => {
    //     return d3.max(d.values, v => v.value.weight);
    //   })
    // ];

    const xScale = d3
      .scaleTime()
      .domain(xExtent)
      .range([0, width]);

    // const yScale = d3
    //   .scaleLinear()
    //   .domain(yExtent)
    //   .range([0, height / 40 - 5]);

    // This could be calculated from xExtent somehow....
    const rectCount = Math.floor(window.innerWidth / 4);

    usableData.forEach(genre => {
      const yExtent = [
        d3.min(genre.values, d => d.value.weight),
        d3.max(genre.values, d => d.value.weight)
      ];

      const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([0, height / 40 - 5]);

      genre.yScale = d3
        .scaleLinear()
        .domain(genre.values.map(d => xScale(new Date(d.key))))
        .range(genre.values.map(d => yScale(d.value.weight)));

      genre.xScale = d3
        .scaleBand()
        .domain(d3.range(rectCount))
        .paddingInner(0.05)
        .range([0, width]);
    });

    return {
      data: usableData,
      dimensions: {
        margin,
        width,
        height
      },
      rectCount,
      xScale
    };
  }

  render() {
    const dimensions = this.state.dimensions;
    const rectcount = this.state.rectCount;

    // console.log(calcWaveRects(usableData[0]));

    function renderGenre(data) {
      return data.map((genre, index) => {
        return (
          <g
            key={genre.key}
            className="genre-group"
            transform={`translate(${0}, ${(index + 1) *
              (dimensions.height / 20)})`}
          >
            <text x={dimensions.margin.left - 10} y="3" className="genre-label">
              {genre.key}
            </text>
            <g transform={`translate(${dimensions.margin.left}, 0)`}>
              {drawWaveRects(calcWaveRects(genre, rectcount))}
            </g>
          </g>
        );
      });

      function calcWaveRects(genre, count) {
        // console.log(genre);
        return d3.range(count).map((rect, ind) => {
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
                y={empty ? -noValue / 2 : -rect.y}
                width={rect.width}
                height={empty ? noValue : rect.height}
              />
            </g>
          );
        });
      }
    }

    const data = this.state.data;

    if (data) {
      return (
        <div>
          <svg
            width={
              dimensions.width +
              dimensions.margin.left +
              dimensions.margin.right
            }
            height={
              dimensions.height +
              dimensions.margin.top +
              dimensions.margin.bottom
            }
          >
            {/* <g
              ref={r => {
                this.yAxis = r;
              }}
            /> */}
            <Trail
              items={renderGenre(data)}
              keys={item => item.key + "barz"}
              from={{ opacity: 0, transform: "translate3d(0,-40px,0)" }}
              to={{ opacity: 1, transform: "translate3d(0,0px,0)" }}
            >
              {item => props => <animated.g style={props}>{item}</animated.g>}
            </Trail>
            <g
              ref={this.xAxisRef}
              transform={`translate(${dimensions.margin.left}, ${
                this.state.dimensions.margin.top
              })`}
            />
            <g ref={this.brushRef} />
          </svg>
        </div>
      );
    } else return null;
  }
}

export default JoyPlot;
