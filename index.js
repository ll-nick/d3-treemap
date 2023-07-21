(async () => {

    const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
    const fetchData = fetch(url).then(response => response.json())
    const data = await fetchData;

    let options = {}
    options.width = 960
    options.height = 570
    options.padding = {
        top: 10,
        left: 20,
        bottom: 10,
        right: 20
    }

    d3.select('body')
        .append('h1')
        .attr('id', 'title')
        .text('Movie Sales')

    d3.select('body')
        .append('div')
        .attr('id', 'description')
        .text('Top 100 Highest Grossing Movies Grouped By Genre')

    const plotter = new TreemapPlotter(data, options)
    let svg = plotter.plot()
    d3.select('body')
        .node()
        .appendChild(svg.node())

    options.height = 200
    const legendPlotter = new LegendPlotter(data, options)
    let legend = legendPlotter.plot()
    d3.select('body')
        .node()
        .appendChild(legend.node())


    document.getElementById("kickstarter").addEventListener("click", async () => {
        const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
        const fetchData = fetch(url).then(response => response.json())
        const data = await fetchData;
        plotter.update(data, svg)
        legendPlotter.update(data, legend)
    });

    document.getElementById("movies").addEventListener("click", async () => {
        const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
        const fetchData = fetch(url).then(response => response.json())
        const data = await fetchData;
        plotter.update(data, svg)
        legendPlotter.update(data, legend)
    });

    document.getElementById("games").addEventListener("click", async () => {
        const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
        const fetchData = fetch(url).then(response => response.json())
        const data = await fetchData;
        plotter.update(data, svg)
        legendPlotter.update(data, legend)
    });
})();