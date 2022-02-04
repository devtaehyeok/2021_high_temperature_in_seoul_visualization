import * as d3 from "d3";

async function drawLineChart() {
  // 1. 데이터 셋 가져오기.
  const dataset = await d3.csv("/data/seoul_2021_2022_temperature.csv");
  // y is temperatue
  const yAccessor = (d) => Number(d["temperatureHigh"]);
  // x is date (1/1/2021)
  const xAccessor = (d) => parseDate(d["date"]);
  const parseDate = d3.timeParse("%m/%d/%Y");

  // 2. 치트 디멘션 선언.
  // 마진을 통해 축, 범례 등 위치 차지
  // bounded(Width|Height)가 실제 데이터가 차지할 공간

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. 캔버스 그리기

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // 4. Create scales
  // y축 스케일 : Number 자료형
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();
  // 어는점은 섭씨 0도.
  const freezingTemperaturePlacement = yScale(0);
  // 어는점 아래 사각형으로 표시
  const freezingTemperatures = bounds
    .append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#0047A0"); // 색상은 태극 블루
  // x축 스케일 - date 자료형
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  // 5. 데이터 그리기

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const line = bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "#CD313A") // 색상은 태극 레드
    .attr("stroke-width", 4);

  // 6. 축 그리기

  const yAxisGenerator = d3.axisLeft().scale(yScale);

  const yAxis = bounds.append("g").call(yAxisGenerator);

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    // 데이터 그래프 높이 만큼 수직이동 (원래 위치는 맨 꼭대기)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);
  // 라벨 추가
  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 20)
    .attr("fill", "#6b6b6b")
    .style("font-size", "1rem")
    .text("High temperature (℃)")
    // 원래 각도는 0도가 아니라 180도임. 시계 반대 방향으로 회전.
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle");

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 4)
    .attr("fill", "#6b6b6b")
    .style("font-size", "1rem")
    .html("Date (yyyy-mm-dd)");
}

drawLineChart();
