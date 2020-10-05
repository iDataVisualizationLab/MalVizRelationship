var settings = {
    ProcessArea: {
        svg_height: 220,
        left: 150,
        bar_height: 35,
        scale_xMin: 10,
        scale_xMax: 800
    },
    MatrixArea: {
        padding: 1,
        row_text_width: 250,
        minValue: 5,
        rect_width: 15,
        rect_height: 15
    }
};

var operationShown;
var active = {};
var firstClick;
var svgStats;
var lensingStatus = false;
var orderedArray = [];
var maxLink = 1;
var availableCommon;
var maxBin;
var maxCall = 0, minCall = 0;
var xScale, yScale;
var streamHeightScale;
var area;
var streamEvent = false;
const categories = ["Registry", "Network", "File", "exe", "dll"];
const stackColor = ["#247b2b", "#a84553", "#c37e37", "#396bab", "#7e7e7e"];
const scaleHeight = d3.scaleThreshold()
    .domain([3, 10, 40, 50, 200, 300, 500, 1000, 2000])
    .range([150, 250, 300, 400, 500, 550, 600, 650, 700, 750]);

var scaleLimit = d3.scaleThreshold()
    .domain([200, 500])
    .range([8, 15, 30]);

const scaleHeightAfter = d3.scaleThreshold()
    .domain([10, 40, 120, 500, 1300, 2500])
    .range([80, 150, 300, 500, 600, 1000, 1500]);

const stack = d3.stack().keys(categories)     // create stack function
    .offset(d3.stackOffsetSilhouette)
;

// let halfLen = len % 2 === 0 ? len / 2 : (len - 1) / 2;

let graphicopt = {
    margin: {top: 0, right: 0, bottom: 0, left: 0},
    width: 1300,
    height: 600,
    scalezoom: 1,
    zoom: d3.zoom(),
    widthView: function () {
        return this.width * this.scalezoom
    },
    heightView: function () {
        return this.height * this.scalezoom
    },
    widthG: function () {
        return this.widthView() - this.margin.left - this.margin.right
    },
    heightG: function () {
        return this.heightView() - this.margin.top - this.margin.bottom
    },
    centerX: function () {
        return this.margin.left+this.widthG()/2;
    },
    centerY: function () {
        return this.margin.top+this.heightG()/2;
    }
}
