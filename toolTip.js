class Tooltip {
    constructor(svg) {
        this.tooltip = svg.append('foreignObject')
            .attr('id', 'tooltip')
            .attr('pointer-events', 'none')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 300)
            .attr('height', 100)
            .attr('opacity', 0)
        this.tooltipText = this.tooltip.append("xhtml:div")
            .attr('background-color', 'black')
            .html('<div id=tooltip-text></div>');
    }

    showTooltip(content, x, y, ...attributes) {
        this.tooltip
            .attr('opacity', 0.8)
            .attr('x', x)
            .attr('y', y)
            .raise()
        this.tooltipText
            .html(`<div id=tooltip-text>${content}</div>`)

        attributes.forEach(attr => {
            this.tooltip.attr(attr[0], attr[1]);
        });

    }

    hideTooltip() {
        this.tooltip
            .attr('opacity', 0)
    }

}