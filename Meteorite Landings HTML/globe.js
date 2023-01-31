var to_radians = Math.PI / 180;
var to_degrees = 180 / Math.PI;

// Helper function: cross product of two vectors v0&v1
function cross(v0, v1) {
    return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
}


function dot(v0, v1) {
    for (var i = 0, sum = 0; v0.length > i; ++i) sum += v0[i] * v1[i];
    return sum;
}


function lonlat2xyz( coord ){
    var lon = coord[0] * to_radians;
    var lat = coord[1] * to_radians;

    var x = Math.cos(lat) * Math.cos(lon);

    var y = Math.cos(lat) * Math.sin(lon);

    var z = Math.sin(lat);

    return [x, y, z];
}

function quaternion(v0, v1) {

    if (v0 && v1) {

        var w = cross(v0, v1),  
            w_len = Math.sqrt(dot(w, w)); 

        if (w_len == 0)
            return;

        var theta = .5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1)))),

            qi  = w[2] * Math.sin(theta) / w_len;
        qj  = - w[1] * Math.sin(theta) / w_len;
        qk  = w[0]* Math.sin(theta) / w_len;
        qr  = Math.cos(theta);

        return theta && [qr, qi, qj, qk];
    }
}

function euler2quat(e) {

    if(!e) return;

    var roll = .5 * e[0] * to_radians,
        pitch = .5 * e[1] * to_radians,
        yaw = .5 * e[2] * to_radians,

        sr = Math.sin(roll),
        cr = Math.cos(roll),
        sp = Math.sin(pitch),
        cp = Math.cos(pitch),
        sy = Math.sin(yaw),
        cy = Math.cos(yaw),

        qi = sr*cp*cy - cr*sp*sy,
        qj = cr*sp*cy + sr*cp*sy,
        qk = cr*cp*sy - sr*sp*cy,
        qr = cr*cp*cy + sr*sp*sy;

    return [qr, qi, qj, qk];
}

function quatMultiply(q1, q2) {
    if(!q1 || !q2) return;

    var a = q1[0],
        b = q1[1],
        c = q1[2],
        d = q1[3],
        e = q2[0],
        f = q2[1],
        g = q2[2],
        h = q2[3];

    return [
        a*e - b*f - c*g - d*h,
        b*e + a*f + c*h - d*g,
        a*g - b*h + c*e + d*f,
        a*h + b*g - c*f + d*e];

}

function quat2euler(t){

    if(!t) return;

    return [ Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2])) * to_degrees,
        Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * to_degrees,
        Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3])) * to_degrees
    ]
}


function eulerAngles(v0, v1, o0) {

   


    var t = quatMultiply( euler2quat(o0), quaternion(lonlat2xyz(v0), lonlat2xyz(v1) ) );
    return quat2euler(t);
}

// ************************************************************************************** //

linearColor = d3.scaleThreshold()
    .domain([100, 1000, 5000, 10000, 15000, 20000, 30000, 50000])
    .range(d3.schemeOrRd[9]);

//Define SVG
const svgL = d3.select('#Legend')
    .attr("viewBox", [0, 0, 960, 50]);

// Legend
var x = d3.scaleSqrt()
    .domain([0, 14600])
    .rangeRound([440, 950]);

var gL = svgL.append("g")
    .attr("class", "key")
    .attr("transform", "translate(-440,15)");

gL.selectAll("rect")
  .data(linearColor.range().map(function(d) {
      d = linearColor.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return linearColor(d[0]); });

gL.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "white")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Meteorite Mass (g)");

gL.call(d3.axisBottom(x)
    .tickSize(13)
    .tickValues(linearColor.domain()))
    .attr("class", "axisWhite")
    .select(".domain")
    .remove();

const width = 960;
const height = 500;
const config = {
  speed: 0.002,
  verticalTilt: -30,
  horizontalTilt: 0
};

let locations = [];
let locs = [];
const svg = d3.select('#Globe')
    .attr("viewBox", [0, 0, width, height]);
const markerGroup = svg.append('g');
const projection = d3.geoOrthographic();
const initialScale = projection.scale();
const path = d3.geoPath().projection(projection);
const center = [width/2, height/2];

var curFrame = 0;
var startFrame = -120;


var scl = Math.min(width, height)/2.5;


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
    div.style("top", (y + 20) + 'px').style("left", (x + 20) + 'px');
};

drawGlobe();
drawGraticule();

function filterLocations(locations) {
    let newLocations = [];
    for (var i = 1; i < locations.length; i++) {
        var prevLoc = locations[i  - 1];
        var curLoc  = locations[i];
        if (prevLoc.year != curLoc.year || Math.sqrt(Math.pow(curLoc.reclat - prevLoc.reclat, 2) + Math.pow(curLoc.reclong - prevLoc.reclong, 2)) > 3) {
            newLocations.push(curLoc);
        }
    }
    return newLocations;
}

function drawGlobe() {
    d3.queue()
        .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')          
        .defer(d3.json, 'landings.json')
        .await((error, worldData, locationData) => {
            svg.selectAll(".segment")
                .data(topojson.feature(worldData, worldData.objects.countries).features)
                .enter().append("path")
                .attr("class", "segment")
                .attr("d", path)
                .style("stroke", "#888")
                .style("stroke-width", "1px")
                .style("fill", (d, i) => 'green')
                // .style("opacity", "0.9");
                locations = locationData;
                locations = locationData.filter(location => (location.reclong != 0 && location.reclat != 0));
                locs = locations.filter((location) => (location.year >= 1870 && location.year <= 1930));
                locs = filterLocations(locs);
                drawMarkers(locs);
                svg.selectAll("path").attr("d", path);
        });
}

function drawGraticule() {
    const graticule = d3.geoGraticule()
        .step([10, 10]);

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "#fff")
        .style("stroke", "#ccc");
}

// Background for the globe
// Source: https://observablehq.com/@sarah37/spinning-globe
var bgCircle = svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", projection.scale())
    .style("fill", "#60cdf7");

var checker = false;

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(
    d =>
      "<div style=text-align:center;color:white;>" + d.name + "<br/>" +
     "<span class='left'>GeoLocation</span><span>&nbsp</span><div class='right'>" + d.GeoLocation + "</div>" + 
     "</div><div style=text-align:center>" + "<span class='left'>Class</span>&nbsp<span></span><div class='right'>" + d.recclass + "</div>" +
     "</div><div style=text-align:center>" + "<span class='left'>Year</span>&nbsp<span></span><div class='right'>" + d.year + "</div>" + 
     "</div><div style=text-align:center>" + "<span class='left'>ID</span>&nbsp<span></span><div class='right'>" + d.id + "</div>" + 
     "</div><div style=text-align:center>" + "<span class='left'>Mass</span>&nbsp<span></span><div class='right'>" + d["mass (g)"] + "g</div>" + 
     "</div><div style=text-align:center>" + "<span class='left'>Status</span>&nbsp<span></span><div class='right'>" + d.fall + "</div>"
  );

tip.direction(function(d) {
  return 'n';
});

tip.offset(function(d) {
  return [-10, 0];
});

svg.call(tip);

var activeTip;

function drawMarkers(locs) {
    markerGroup.selectAll('circle').remove();
    const markers = markerGroup.selectAll('circle')
        .data(locs);
    //console.log(locs);
    markers
        .enter()
        .append('circle')
        .merge(markers)
        .attr('cx', d => projection([d.reclong, d.reclat])[0])
        .attr('cy', d => projection([d.reclong, d.reclat])[1])
        .attr('fill', d => {
            const coordinate = [d.reclong, d.reclat];
            gdistance = d3.geoDistance(coordinate, projection.invert(center));
            return gdistance > 1.57 ? 'none' : linearColor(d['mass (g)']);
        })
        .attr('r', 1.75)
        .on('mouseover', function(d) {
            tip.show(d);
            activeTip = d;
        })
        .on('mouseout', function(d) {
            tip.hide(d);
        });

    markerGroup.each(function () {
        this.parentNode.appendChild(this);
    });
}

// enable drag
var drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged);

var gpos0, o0, gpos1, o1;
svg.call(drag);

// enable zoom
var zoom = d3.zoom()
    .scaleExtent([0.75, 50]) //bound zoom
    .on("zoom", zoomed);

svg.call(zoom);

// functions for dragging
function dragstarted() {
    gpos0 = projection.invert(d3.mouse(this));
    o0 = projection.rotate();
}

function dragged() {
    gpos1 = projection.invert(d3.mouse(this));
    o0 = projection.rotate();
    o1 = eulerAngles(gpos0, gpos1, o0);
    if (o1 !== undefined) {
        projection.rotate(o1);
    }
    svg.selectAll("path").attr("d", path);
    drawMarkers(locs);
}

// functions for zooming
function zoomed() {
    projection.scale(d3.event.transform.translate(projection).k * scl);
    bgCircle.attr("r", projection.scale());
    svg.selectAll("path").attr("d", path);
    drawMarkers(locs);
    tip.hide(activeTip);
}

document.addEventListener( "input", locationRange );

function locationRange(event){
    var element = event.target;
    const rangeInput = document.querySelectorAll(".range-input input");
    let minRange = parseInt(rangeInput[0].value);
    let maxRange = parseInt(rangeInput[1].value);
    if (element.className === 'min' || element.className === 'max') {
        locs = locations.filter(location => (location.year >= minRange && location.year <= maxRange));
        drawMarkers(locs);
    }
}
