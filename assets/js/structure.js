// HTML5 session Storage
console.log(localStorage);
var typeParam = localStorage.getItem('typeParam');
localStorage.removeItem('typeParam');
var idParam = localStorage.getItem('idParam');
localStorage.removeItem('idParam');
console.log(typeParam);
console.log(idParam);
console.log(localStorage);

//Load google chart type
google.charts.load("current", {packages:['orgchart']});

switch (typeParam) {
  case 'topic':
    document.getElementById('struct_title').innerHTML = "Topic " + idParam + " Post Structure";

    //Org chart of post relationship structure
    var orgAry = new Array();
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].topicID == idParam) {
        if (posts[i].parent == null) orgAry.push([(posts[i].id).toFixed(0), ""]);
        else orgAry.push([(posts[i].id).toFixed(0), (posts[i].parent).toFixed(0)]);
      }
    }
    google.charts.setOnLoadCallback(drawOrgChart);
    function drawOrgChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Student ID');
      data.addColumn('string', 'Parent Post');
      data.addRows(orgAry);
      var options = {
        title: "Organization of Posts",
        titleTextStyle: {
          fontName: 'Montserrat',
          fontSize: 18,
          bold: true
        },
        size: "small"
      };
      var chart = new google.visualization.OrgChart(document.getElementById('content'));
      chart.draw(data, options);
    }
    break;

  case 'student':
    break;
}
