function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  d3.json(`/metadata/${sample}`).then(function(sampleData) {
    console.log(sampleData);
    // Use d3 to select the panel with id of `#sample-metadata`

    var md_panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    md_panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleData).forEach(([key, value]) => {
      md_panel.append('h6').text(`${key}, ${value}`);
    })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })}

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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
