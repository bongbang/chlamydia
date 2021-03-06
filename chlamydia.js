"use strict";
var margin = {top: 20, right: 80, bottom: 10, left: 70},
    width = 300,
    height = width*2;

var V =	92.5, // Sensitivity
  U = 98.6, // Specificity
  R = 0.65, // Chlamydia prevalence of white American female 25-29
  R_young = 1.87, // WF 18-24
  R_black = 10.49; // BF 18-24

function makeFrame(V,U,R,text) { // frame factory
	var frame = {
		V: V,
		U: U,
		R: R,
		text: text
	};
	return frame;
}

function PPV(V,U,R) { // positive predictive value
	return V*R*100/(V*R + (100-U)*(100-R));
}

var frames = [
	makeFrame(0,100,0,
		"Let the square represent <strong>white American women aged 25&ndash;29</strong>."),
	makeFrame(0,100,R,
		"The red slice represents those infected with <strong>chlamydia</strong>.<br/><br/>" +
	"Let’s see what happens if we subject the entire demographic to <em>mandatory screening</em>."),
	makeFrame(V,100,R,
	"Given the test’s <strong>sensitivity</strong>, " +V+ "% of the infected group can be expected to test positive, as shown in deep red."),
	makeFrame(V,U,R,
	"And given the test’s <strong>specificity</strong>, 100 &minus; " +U+
		" = " +(100-U).toFixed(1)+ "% of the <em>healthy</em> group can also be expected to test positive, as shown in deep green."),
	makeFrame(V,U,R,
	"Among the positive testers, <strong>true positives</strong> (red) make up only " +PPV(V,U,R).toFixed(0)+
	"%, which means that <strong>false positives</strong> (green) are as high as " +(100 - PPV(V,U,R)).toFixed(0)+ "%!" ),
	makeFrame(V,U,R,
	"This surprising result is due to the low <strong>prevalence rate</strong>.<br/><br/>" +
	"To illustrate, let’s do the same analysis on a demographic with a higher prevalence of chlamydia."),
	makeFrame(V,U,R_young,
	"Change the age group to <strong>18&ndash;24</strong> (still white American women), " +
	"and false positives drop to " +(100 - PPV(V,U,R_young)).toFixed(0)+ "% thanks to higher prevalence."),
	makeFrame(V,U,R_black,
	"Change the racial group to <strong>black</strong> on top of that, and false positives are down to " +(100 - PPV(V,U,R_black)).toFixed(0)+ "%.<br/><br/>" +
	"Even here, the net is still cast too wide. In real life, there is no mandatory screening for chlamydia. " +
	"You get tested only if you have symptoms or risk factors such as having an infected partner."),
	makeFrame(V,U,50,
	"If, say, half of this suspect group have chlamydia, then a positive result is highly dispositive. " +
	"Expected false positives are only " +(100 - PPV(V,U,50)).toFixed(0)+
	"%, i.e. the positive prediction value (PPV) is " +PPV(V,U,50).toFixed(0)+ "%!<br/><br/>" +
	"<strong>Moral of the story:</strong> Testing works well if and only if you know when to use it.")
];

var lastFrame = frames.length-1;
frames.addShow = function(showElement, keyFrames, flip) {
	var a = flip !== 'off'; // true by default
	this.forEach(function(frame, i) {
		frame[showElement] = keyFrames.indexOf(i) !== -1 ? a : !a;
	});
};

frames.addStrong = function(showElement, keyFrames, flip) {
	if (flip === 'off') {
		this.forEach(function(frame, i) {
			if (frame[showElement] && keyFrames.indexOf(i) === -1) {
				frame[showElement] = 'strong';
			}
		});
	} else {
		keyFrames.forEach(function (frameNumber) {
			this[frameNumber][showElement] = 'strong';
		}, this);
	}
};

frames.addShow('showR',[0,4],'off');
frames.addShow('showV',[0,1,4], 'off');
frames.addShow('showU',[0,1,2,4],'off');

frames.addStrong('showR',[2,3],'off');
frames.addStrong('showV',[2]);
frames.addStrong('showU',[3]);

frames.addShow('showPlusMinus',[0,1,4],'off');

// Styling
var textDuration = 500,
		fontStyle = "400 14px 'Helvetica Neue', Helvetica, Arial, sans-serif";

// Page elements
var container = d3.select('body').append('div')
	.attr('id', 'container')
	.style({
		'position': 'relative',
		'font':fontStyle,
		'width': width + margin.left + margin.right + 'px',
		'margin': 0,
		'padding': 0
	});

var offset = {top: 20, bottom: 10}; // textbox tweak
var textbox = container.append('div')
	.attr('id', 'textbox')
	.style({
		'position': 'absolute',
		'box-sizing': 'border-box',
		'top': margin.top + offset.top + 'px',
		'left': width/2 + margin.left + 'px',
		'width': width/2 + 'px',
		'height': width - offset.top - offset.bottom + 'px',
		'padding': '10px 0 0 8px',
		'margin': 0,
		'z-index': 1
	});

container.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

	.append('style')
	.text(
		// '#buttonsPlace > .button:hover > use {fill: #000;}' +
		'.button {cursor: pointer}' +
		'.button:active rect {fill: #EEE}' + // when mousedown
		'.gray {fill: #CCC}' +
		'.black {fill: #000}'
		// '#buttonsPlace:hover use {fill: #CCC;}'
		);

var svg = container.select('svg').append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// SVG icons and clippaths
var defs = svg.append('defs');
defs.append('clipPath')
	.attr('id', 'positive_clip')
	.append('rect')
	.attr('class', 'fal_neg');
defs.append('clipPath')
	.attr('id', 'negative_clip')
	.append('rect')
	.attr('class', 'tru_neg');

// svg icons from flaticon, must attribute
defs.append('symbol')
	.attr('id','backward')
	.attr('viewBox', "0 0 477.2 477.2")
	.append('path')
	.attr('d',"M145.2 238.6l215.5-215.5c5.3-5.3 5.3-13.8 0-19.1s-13.8-5.3-19.1 0l-225.1 225.1c-5.3 5.3-5.3 13.8 0 19.1l225.1 225c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4c5.3-5.3 5.3-13.8 0-19.1L145.2 238.6z");

defs.append('symbol')
	.attr('id','forward')
	.attr('viewBox', "0 0 477.2 477.2")
	.append('path')
	.attr('d',"M360.7 229.1l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1 0s-5.3 13.8 0 19.1l215.5 215.5 -215.5 215.5c-5.3 5.3-5.3 13.8 0 19.1 2.6 2.6 6.1 4 9.5 4 3.4 0 6.9-1.3 9.5-4l225.1-225.1C365.9 242.9 365.9 234.3 360.7 229.1z");

var repeat = defs.append('symbol')
	.attr('id','repeat')
	.attr('viewBox', "0 0 489.7 489.7");
repeat.append('path')
	.attr('d',"M112.2 97.1c72.3-65.4 180.5-66.4 253.8-6.7l-58.1 2.2c-7.5 0.3-13.3 6.5-13 14 0.3 7.3 6.3 13 13.5 13 0.2 0 0.3 0 0.5 0l89.2-3.3c7.3-0.3 13-6.2 13-13.5v-1c0-0.2 0-0.3 0-0.5v-0.1l0 0 -3.3-88.2c-0.3-7.5-6.6-13.3-14-13 -7.5 0.3-13.3 6.5-13 14l2.1 55.3c-36.3-29.7-81-46.9-128.8-49.3 -59.2-3-116.1 17.3-160 57.1 -60.4 54.7-86 137.9-66.8 217.1 1.5 6.2 7 10.3 13.1 10.3 1.1 0 2.1-0.1 3.2-0.4 7.2-1.8 11.7-9.1 9.9-16.3C36.7 218.2 59.1 145.1 112.2 97.1z");
repeat.append('path')
	.attr('d',"M462.5 195.5c-1.8-7.2-9.1-11.7-16.3-9.9 -7.2 1.8-11.7 9.1-9.9 16.3 16.9 69.6-5.6 142.7-58.7 190.7 -37.3 33.7-84.1 50.3-130.7 50.3 -44.5 0-88.9-15.1-124.7-44.9l58.8-5.3c7.4-0.7 12.9-7.2 12.2-14.7s-7.2-12.9-14.7-12.2l-88.9 8c-7.4 0.7-12.9 7.2-12.2 14.7l8 88.9c0.6 7 6.5 12.3 13.4 12.3 0.4 0 0.8 0 1.2-0.1 7.4-0.7 12.9-7.2 12.2-14.7l-4.8-54.1c36.3 29.4 80.8 46.5 128.3 48.9 3.8 0.2 7.6 0.3 11.3 0.3 55.1 0 107.5-20.2 148.7-57.4C456.1 357.9 481.7 274.8 462.5 195.5z");

	// Buttons
var buttonsPlace = svg.append('g')
	.attr('transform', 'translate(' + width + ', ' + -margin.top + ')')
	.attr('id', 'buttonsPlace');

var buttonWidth = 32;
var buttons = buttonsPlace.selectAll('.button')
	.data([-1, 1])
	.enter()
	.append('g')
	.attr('transform', function(d,i) {
		return 'translate(' + i*buttonWidth + ',0)';
	})
	.attr('class', 'button');

buttons.append('rect')
	.attr('width', buttonWidth)
	.attr('height', buttonWidth)
	.attr('fill', 'transparent');

var iconColor = '#CCC',
		iconSize = 26;

buttons.append('use')
	.attr('xlink:href', function(d,i) {
		return (i === 0) ? '#backward' : '#forward';
	})
	.attr({'width': iconSize,
		'height': iconSize,
		'fill': iconColor,
		'x': (buttonWidth-iconSize)/2,
		'y': (buttonWidth-iconSize)/2});

var nextButton = buttonsPlace.selectAll('g:nth-child(2)').select('use');

// PLOTTING
// Quadrant
var posImage = svg.append('image')
			.attr('clip-path', 'url(#positive_clip)'),
		negImage = svg.append('image')
			.attr('clip-path', 'url(#negative_clip)');
svg.selectAll('image')
	.attr('xlink:href', 'images/friends_bw.jpg')
	.attr('width', width)
	.attr('height', width);

var truPos = svg.append('rect')
		.attr('fill', '#D00'),
	falNeg = svg.append('rect')
		.attr('class', 'fal_neg')
    .attr('fill', '#F99'), // previously #FAA
	falPos = svg.append('rect')
		.attr('fill','#070'),
	truNeg = svg.append('rect')
		.attr('class', 'tru_neg')
		.attr('fill', '#CCC');

// Labels
var labels = svg.selectAll('text.label')
		.data(['R','V','U'])
		.enter()

		.append('text')
		.attr('id', function(d) {return d + '-label';})
		.attr('class','label')
		.text(function(d) {return frames[0][d];})
		.attr('opacity',0);

var rLabel = svg.select('#R-label')
		.attr('text-anchor', 'middle');
var vLabel = svg.select('#V-label')
			.attr({
				'x': -10,
				'text-anchor': 'end',
				'alignment-baseline': 'middle'
			});
var uLabel = svg.select('#U-label')
			.attr({
				'x': width + 10,
				'text-anchor': 'start',
				'alignment-baseline': 'middle'
			});

var plusMinus = svg.append('g')
	.attr('transform', 'translate(-10,' + width + ')')
	.selectAll('text')
	.data(['+', '&minus;'])

	.enter()
	.append('text')
	.attr('y', function(d,i) {return (i-0.5)*3;})
	.attr('text-anchor', 'end')
	.attr('opacity', 0)
	.attr('alignment-baseline', function(d,i) {
		return i === 0 ? 'text-after-edge' : 'text-before-edge';
	})
	.html(function(d) {return d;});

container.append('p')
	.style({
		'margin': 0,
		'font-size': '12px',
		'color': '#666'
	})
	.html(
			'By Tom Vamvanij <br>' +
			'Sources: <a href="http://www.cdc.gov/nchs/nhanes/">NHANES</a>, 2001&ndash;2012 (prevalence). ' +
			'Cook et al., <a href="http://www.ncbi.nlm.nih.gov/pubmed/15941699">Ann Intern Med.</a>, 2005 (sensitivity & specificity). ' +
			'<em>See also</em> Miller et al., <a href="http://jama.jamanetwork.com/article.aspx?articleid=198722#REF-JOC32386-20">J Am Med Assoc.</a>, 2004.');

var scale = d3.scale.linear()
  .domain([0,100])
  .rangeRound([0,width]);

function plot(i, iOld, delay, rectDuration) { // Plotting workhorse
	var currentFrame = frames[i],
		oldFrame = frames[iOld], // needed as switch for Runnumber
		sU = scale(currentFrame.U),
		sV = scale(currentFrame.V),
		sR = scale(currentFrame.R),
		rectDuration = rectDuration || 1000;

	var testNegOn = (i !== 4); // Shows positive only on Frame 4

	function imageSwitch(selection) {
		selection
		.attr('opacity', testNegOn ? 1 : 0)
		.attr('xlink:href', function(){
			if (i === 6) { return 'images/girls_bw.jpg';
			} else if (i === 7) { return 'images/tlc_bw.jpg';
			} else if (i === 8) { return 'images/kardashian_bw.jpg';
			} else { return 'images/friends_bw.jpg';
			}
		});
	}

	// Condition Positive (Left) side of plot
	posImage.transition().delay(delay).duration(rectDuration)
		.attr('y', width - sV)
		.call(imageSwitch);
  truPos.transition().delay(delay).duration(rectDuration)
    .attr('y', width - sV)
    .attr('height', sV)
    .attr('width', sR);

  svg.selectAll('.fal_neg').transition().delay(delay).duration(rectDuration)
    .attr('y', width)
    .attr('height', width - sV)
    .attr('width', sR)
		.attr('opacity', testNegOn ? 0.7 : 0);

	// Condition Negative (Right) side of plot
	negImage.transition().delay(delay).duration(rectDuration)
		.attr('y', sU)
		.call(imageSwitch);
	falPos.transition().delay(delay).duration(rectDuration)
    .attr({
			'x': sR,
			'y': sU,
			'height': width - sU,
			'width': width - sR
		});

	svg.selectAll('.tru_neg').transition().delay(delay).duration(rectDuration)
		.attr({
			'x': sR,
			'y': width,
			'height': sU,
			'width': width - sR,
			'fill':  i === 0 ? '#CCC' :'#BFB',
			'opacity': testNegOn ? 0.6 : 0
		});

	// Labels
	function runNumber(selection, end, decimal) {
		if (decimal === undefined) decimal = 1; // No d = d || 1 syntax b/c 0 is falsey
		return function() {
			var n = d3.interpolateNumber(selection.text().replace(/%/g, ""), end);
			return function(t) {d3.select(this).text(n(t).toFixed(decimal)+'%');};
		};
	}

	if (currentFrame.R !== oldFrame.R ||
			currentFrame.V !== oldFrame.V ||
			currentFrame.U !== oldFrame.U) {

		rLabel.transition().delay(delay).duration(rectDuration)
			.attr('x', sR/2)
			.attr('y', width - sV - 5)
			.tween('text', runNumber(rLabel,currentFrame.R,
						(currentFrame.R < 10 && iOld !== lastFrame) ? 2 : 1));

		vLabel.transition().delay(delay).duration(rectDuration)
			.attr('y', width - sV/2)
			.tween('text', runNumber(vLabel, currentFrame.V));

		uLabel.transition().delay(delay).duration(rectDuration)
			.attr('y', width + sU/2)
			.tween('text', runNumber(uLabel, currentFrame.U)) ;
	}
	return delay + rectDuration;
}

function labelsAdjust(i, iOld, delay) {
	var currentFrame = frames[i],
			oldFrame = frames[iOld],
			fontShiftDuration = 500,
			toggled = false;

	labels.each(function(d) {
		var showD = 'show' + d;
		if (currentFrame[showD] !== oldFrame[showD]) {
			var currentD = currentFrame[showD];
			toggled = true;
			d3.select(this).transition()
				.duration(fontShiftDuration)
				.delay(delay)
				.attr('opacity', currentD ? 1 : 0)
				.attr('font-size', currentD === 'strong' ? '1.5em' : '1em')
				.attr('font-weight', currentD === 'strong' ? 700 : 400);
		}
	});

	return toggled ? fontShiftDuration + delay : delay;
}

// PLOT RENDERING
var i = 0; // global required for onClick function
plot(i,1,0);
textbox.html(frames[i].text);
nextButton.attr('fill', 'orange');

// OnClick action
buttons.on('click', function(d) {
	var iOld = i;

	i += d;
	if (i > lastFrame) {i = 0;
	} else if (i < 0) {i = lastFrame;
	}

	var currentFrame = frames[i],
		oldFrame = frames[iOld];

	// ===== Transition sequence hereonafter =====
	// Button dims
	nextButton.attr('fill', iconColor); // turn off highlight
	nextButton.attr('xlink:href', i === lastFrame ? '#repeat' : '#forward');

	// Textbox disappears
	textbox.transition().duration(textDuration)
		.style('opacity', 0)
		.each('end', function() {
			textbox.html(currentFrame.text);
		});

	var interDelay = 500,
		innerDelay = interDelay + textDuration;
	// "inner" means label & plot transitions, which are sandwiched btw text disapparance & reintry
	//
	// Labels adjust before rects if advancing, the reverse otherwise,
	// Except special case where they happen at the same time.
	var labelStart = innerDelay, rectStart = innerDelay, innerFinish = 0,
		forward = (d === 1 && i !== 0) || (d === -1 && i === lastFrame);

	if (currentFrame.R === oldFrame.R &&
			currentFrame.V === oldFrame.V &&
			currentFrame.U === oldFrame.U) {
		labelsAdjust(i, iOld, labelStart); // same time
		innerFinish = plot(i,iOld, rectStart, textDuration);
	} else if (forward) {
		rectStart = labelsAdjust(i,iOld,labelStart); // labels first
		innerFinish = plot(i,iOld, rectStart);
	} else {
		labelStart = plot(i,iOld, rectStart); // rects first
		innerFinish = labelsAdjust(i,iOld, labelStart);
	}

	// ** reset rLabel when repeating
	if (i === 0 && iOld === lastFrame) {
		window.setTimeout(function() {rLabel.text(frames[0].R.toFixed(2));}, innerFinish);
	}

	// Textbox reappears
	textbox.transition().duration(textDuration)
		.delay(innerFinish + interDelay)
		.style('opacity', 1);

	// Button lights up
	buttons.selectAll('use').attr('class','');
	if (i !== lastFrame) {
		nextButton.transition().duration(textDuration)
			.delay(innerFinish + interDelay)
			.attr('fill', 'orange');
	}

	// +/- appears/disappears w/ labels except where adjustment is required to avoid clash
	if (currentFrame.showPlusMinus !== oldFrame.showPlusMinus) {
		plusMinus.transition().duration(textDuration)
			.delay(function() {
				if (forward) {
					return [2,lastFrame].indexOf(i) !== -1 ? labelStart + 700 : labelStart;
				} else {
					return [0,1].indexOf(i) !== -1 ? labelStart - 700 : labelStart;
				}
			})
			.attr('opacity', (currentFrame.showPlusMinus) ? 1 : 0 );
	}
});

buttons.on('mouseover', function() {
	buttons.selectAll('use').attr('class','gray');
	d3.select(this).select('use').attr('class','black');
});

buttons.on('mouseout', function() {
	buttons.selectAll('use').attr('class','');
});
