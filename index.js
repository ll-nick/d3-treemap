(async () => {

    const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
    const fetchData = fetch(url).then(response => response.json())
    const data = await fetchData;

    let options = {}
    options.width = 960
    options.height = 600
    options.padding = {
        top: 50,
        left: 0,
        bottom: 40,
        right: 100
    }

    d3.select('#chart-container')
        .append('h1')
        .attr('id', 'title')
        .text('Movie Sales')

    d3.select('#chart-container')
        .append('div')
        .attr('id', 'description')
        .text('Top 100 Highest Grossing Movies Grouped By Genre')

    const plotter = new TreemapPlotter(data, options)
    let svg = plotter.plot()
    d3.select('#chart-container')
        .node()
        .appendChild(svg)

})();