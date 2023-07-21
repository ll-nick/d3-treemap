class LegendPlotter {
    constructor(dataset, options) {
        if (!dataset || !options || !options.width || !options.height || !options.padding) {
            throw new Error('Invalid parameters: dataset and options with width, height, and padding are required.');
        }
        this.dataset = dataset
        this.width = options.width
        this.height = options.height
        this.padding = options.padding

        this.#prepareData()
        this.#createColorScale()
    }

    plot() {
        let svg = d3.create('svg')
            .attr('width', this.width)
            .attr('height', this.height)

        this.#createLegend(svg)

        return svg.node()
    }

    #createLegend(svg) {
        const rectSize = 20;
        const textWidth = 100;
        const spacing = 5;
        const numOfColumns = 3;
        const categories = this.#getArraOfCategories()
        const itemsPerColumn = Math.ceil(categories.length / numOfColumns);

        // Calculate the height of the legend based on the number of rows
        const legendWidth = numOfColumns * (rectSize + spacing + textWidth)

        // Create the SVG group for the legend
        var legendGroup = svg.append('g')
            .attr('transform', `translate(${this.padding.left},${this.padding.top})`)
            .attr('id', 'legend')

        // Generate colored rectangles and text for each item in the legend
        var legendItems = legendGroup.selectAll('.legend-item')
            .data(categories)
            .enter().append('g')
            .attr('transform', (d, i) => {
                const col = Math.floor(i / itemsPerColumn);
                const row = i % itemsPerColumn;
                const x = this.width / 2 - legendWidth / 2 + col * (rectSize + spacing + textWidth);
                const y = row * (rectSize + spacing);
                return `translate(${x},${y})`;
            });

        // Colored rectangles
        legendItems.append('rect')
            .attr('class', 'legend-item')
            .attr('width', rectSize)
            .attr('height', rectSize)
            .attr('fill', d => this.colorScale(d));

        // Text labels
        legendItems.append('text')
            .attr('x', rectSize + spacing)
            .attr('y', rectSize / 2)
            .attr('dy', '0.35em')
            .text(d => d);
    }

    #prepareData() {
        this.root = d3.hierarchy(this.dataset).sum(function (d) { return d.value })
            .sort(function (a, b) { return b.value - a.value; })
        d3.treemap()
            .size([this.width - this.padding.left - this.padding.right, 0.8 * this.height - this.padding.top - this.padding.bottom])
            .padding(1)
            (this.root)
    }

    #createColorScale() {
        let domain = this.#getArraOfCategories()
        let range = d3.schemeYlGnBu[domain.length]
        this.colorScale = d3.scaleOrdinal(domain, range)
    }

    #getArraOfCategories() {
        return [...new Set(this.root.leaves().map(item => item.data.category))]
    }

}