function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  d3.json(`/metadata/${sample}`).then(function(sampleData) {
    console.log(sampleData);
    // Use d3 to select the panel with id of `#sample-metadata`

    var md_panel = d3.select("#sample-metadata");
    var MetaData = []

    // Use `.html("") to clear any existing metadata
    md_panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleData).forEach(([key, value]) => {
      MetaData.push([key, value])
      md_panel.append('h6').text(`${key}, ${value}`);
    })

      var level = parseFloat(MetaData[5][1])*18;
      console.log(level);
  
      // Trig to calc meter point
      var degrees = 171 - level,
          radius = .5;
          console.log(degrees)
      var radians = (degrees * Math.PI) / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
  
      // Path: may have to change to create a better triangle
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
          pathX = String(x),
          space = ' ',
          pathY = String(y),
          pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
      var data = [
      { 
        type: 'scatter',
        x:[0], 
        y:[0],
        marker: {size: 12, color:'850000'},
        showlegend: false,
        name: 'Freq',
        text: level,
        hoverinfo: 'text+name'
      },
      { 
        values: [50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50],
        rotation: 90,
        text: ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0", ""],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:[
          "rgba(0, 105, 11, .5)",
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0", ""],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
      }];
  
      var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      height: 457.5,
      width: 450,
      xaxis: {
        zeroline:false, 
        showticklabels:false,
        showgrid: false, 
        range: [-1, 1]},
      yaxis: {
        zeroline:false, 
        showticklabels:false,
        showgrid: false, 
        range: [-1, 1]}
      };
  
      Plotly.newPlot('gauge', data, layout);
  })}

    // BONUS: Build the Gauge Chart

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sampleData) {
    console.log(sampleData);

    const otu_ids = sampleData.otu_ids;
    const sample_values = sampleData.sample_values;
    const otu_labels = sampleData.otu_labels;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Belly Button',
      showlegend: false,
      xaxis: {title: "OTU IDs"},
      yaxis: {title: "Sample Values"}
    };
    
    Plotly.plot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: 'pie'
    }];
    
    var layout = {
      // margin: {t: 10, l: 200}
    };
    
    Plotly.newPlot('pie', data, layout);
})}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    // buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  // buildGauge(newSample);
}

// Initialize the dashboard
init();
