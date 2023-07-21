class TreemapPlotter {
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
        let treemapGroup = svg.append("g")
            .attr('transform',
                `translate(${this.padding.left}, ${this.padding.top})`)
        let tooltip = new Tooltip(treemapGroup);


        this.#plotData(treemapGroup)
        this.#enableTooltipOnMouseOver(treemapGroup, tooltip)

        return svg.node()
    }

    #prepareData() {
        this.root = d3.hierarchy(this.dataset).sum(function (d) { return d.value })
            .sort(function (a, b) { return b.value - a.value; })
        d3.treemap()
            .size([this.width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom])
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

    #plotData(svg) {
        svg.selectAll('.tile')
            .data(this.root.leaves())
            .enter()
            .append('rect')
            .attr('class', 'tile')
            .attr('data-name', d => d.data.name)
            .attr('data-category', d => d.data.category)
            .attr('data-value', d => d.data.value)
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style('stroke', 'black')
            .style('fill', d => this.colorScale(d.data.category))

        svg.selectAll('.tile-text')
            .data(this.root.leaves())
            .enter()
            .append('text')
            .attr('class', 'tile-text')
            .attr('x', function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
            .attr('y', function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
            .text(function (d) { return d.data.name })
            .attr('font-size', '15px')
            .attr('fill', 'black')

    }

    #enableTooltipOnMouseOver(svg, tooltip) {
        svg.selectAll(".tile")
            .on('mouseover', (event, d) => {
                let [mouseXRelativeToSVG, mouseYRelativeToSVG] = d3.pointer(event, svg.node())
                tooltip.showTooltip(this.#getToolTipText(d), mouseXRelativeToSVG, mouseYRelativeToSVG, ['data-value', d.data.value]);
            })
            .on('mouseout', (e) => {
                tooltip.hideTooltip();
            })
    }

    #getToolTipText(d) {
        return `Name: ${d.data.name}
            Category: ${d.data.category}
            Value: ${d.data.value}`
    }

}