//Main file of execution for CS765 Discussion Dashboard(s)

//TODO - add drill clicks to the area boxes for Volume of Posts by Topic & Student
          //Topic - Count Initial vs. Reply vs. Reply-Reply
                    //Breakdown by Monday/Tuesday/Wednesday?
          //Student - Count Initial vs. Reply vs. Reply-Reply
                    //Breakdown by Monday/Tuesday/Wednesday

////////////////////////////////////////////////////////////////////////////////
//Global variables for use in dashboard data
const DashboardType = {
  O: "Overview",
  T: "Topic",
  S: "Student",
};
var currentDB = DashboardType.O;
var currentAssignment = null;
var currentStudent = null;
var dbTitleElement = document.getElementById('db_title');
var dbRecordSelect = document.getElementById('record_select');
var Obutton = document.getElementById('o_button');
var Abutton = document.getElementById('a_button');
var Sbutton = document.getElementById('s_button');
var contentTop = document.getElementById('content_top');
var contentBottom = document.getElementById('content_bottom');

//Execution begins here with call to buildDB()
buildDB();
//After loading the overview dashboard, do some pre-calculations for others
//Build the date arrays necessary for Post Volume per Day Bar Chart
var dayBreakdowns = buildDayDistributions();
//Build the student post arrays for Post Volume Data by Student
var stdtPostInfo = getStudentPostMetrics();
var allStdtPostArr = new Array;
var allStdtPostMed = 0;
var stdtPostCounts = new Array();
for (var i = 0; i < stdtPostInfo.length; i++) {
  var tmp = 0;
  for (var j = 0; j < stdtPostInfo[i][1].length; j++) {
    tmp += stdtPostInfo[i][1][j][1];
    stdtPostCounts.push(stdtPostInfo[i][1][j][1]);
  }
  allStdtPostArr.push(tmp / stdtPostInfo[i][1].length);
}
stdtPostCounts.sort(function(a, b) {return a - b;});
var stdtPostAvg = 0;
for (var i = 0; i < allStdtPostArr.length; i++) {
  stdtPostAvg += allStdtPostArr[i];
}
stdtPostAvg = stdtPostAvg / allStdtPostArr.length;
if (stdtPostCounts.length % 2 != 0) {
  var tmpIndx = Math.floor(stdtPostCounts.length / 2);
  allStdtPostMed = stdtPostCounts[tmpIndx];
}
else {
  var tmpIndx = stdtPostCounts.length / 2;
  allStdtPostMed = stdtPostCounts[tmpIndx]
  allStdtPostMed += stdtPostCounts[tmpIndx - 1];
  allStdtPostMed = allStdtPostMed / 2;
}

////////////////////////////////////////////////////////////////////////////////
//Builds dashboard to screen based on the currentDB variable
function buildDB() {
  //Set the title
  dbTitleElement.innerHTML = currentDB + " Dashboard";
  switch (currentDB) {
    case "Topic":
      //Update buttons
      Obutton.setAttribute('class', "btn btn-light");
      Abutton.setAttribute("class", "btn btn-primary");
      Sbutton.setAttribute("class", "btn btn-light");
      //Wipe content sections
      while (contentTop.firstChild) {contentTop.removeChild(contentTop.firstChild);}
      while (contentBottom.firstChild) {contentBottom.removeChild(contentBottom.firstChild);}
      //Wipe selection section
      while (dbRecordSelect.firstChild) {dbRecordSelect.removeChild(dbRecordSelect.firstChild);}
      //Reset selection section
      var aSelect = document.createElement('Select');
      aSelect.setAttribute("id", "assignmentSelect");
      aSelect.setAttribute("class", "form-control");
      for (var i = 0; i < assignments.length; i++) {
        var tmpOpt = document.createElement('Option');
        tmpOpt.setAttribute("value", assignments[i][0]);
        tmpOpt.innerHTML = assignments[i][0];
        aSelect.appendChild(tmpOpt);
      }
      //Add to DOM
      dbRecordSelect.appendChild(aSelect);
      //Build content - assumes assignments array populated
      buildAssignmentContent(assignments[0][0]);
      break;

    case "Student":
      //Update buttons
      Obutton.setAttribute('class', "btn btn-light");
      Abutton.setAttribute("class", "btn btn-light");
      Sbutton.setAttribute("class", "btn btn-primary");
      //Wipe content sections
      while (contentTop.firstChild) {contentTop.removeChild(contentTop.firstChild);}
      while (contentBottom.firstChild) {contentBottom.removeChild(contentBottom.firstChild);}
      //Wipe selection section
      while (dbRecordSelect.firstChild) {dbRecordSelect.removeChild(dbRecordSelect.firstChild);}
      //Reset selection section
      var sSelect = document.createElement('Select');
      sSelect.setAttribute("id", "studentSelect");
      sSelect.setAttribute("class", "form-control");
      for (var i = 0; i < students.length; i++) {
        var tmpOpt = document.createElement('Option');
        tmpOpt.setAttribute("value", students[i][0]);
        tmpOpt.innerHTML = students[i][0];
        sSelect.appendChild(tmpOpt);
      }
      //Add to DOM
      dbRecordSelect.appendChild(sSelect);
      //Build content - assumes students array populated
      buildStudentContent(students[0][0]);
      break;

    case "Overview":  //Also default case, so fall through
    default:
      //Update buttons
      Obutton.setAttribute('class', "btn btn-primary");
      Abutton.setAttribute("class", "btn btn-light");
      Sbutton.setAttribute("class", "btn btn-light");
      //Wipe content sections
      while (contentTop.firstChild) {contentTop.removeChild(contentTop.firstChild);}
      while (contentBottom.firstChild) {contentBottom.removeChild(contentBottom.firstChild);}
      //Wipe selection section
      while (dbRecordSelect.firstChild) {dbRecordSelect.removeChild(dbRecordSelect.firstChild);}
      //Build content
      buildOverviewContent();
      break;
  }
} //END buildDB()


////////////////////////////////////////////////////////////////////////////////
//These fucntions execute upon button click of relevant buttons; they reset the
//dashboard type and call buildDB()
function selectOverviewDB() {
  currentDB = DashboardType.O;
  currentAssignment = null;
  currentStudent = null;
  buildDB();
} //END selectOverviewDB()
function selectAssignmentDB(id) {
  currentDB = DashboardType.T;
  if (id != null) currentAssignment = id;
  currentStudent = null;
  buildDB();
} //END selectAssignmentDB()
function selectStudentDB(id) {
  currentDB = DashboardType.S;
  if (id != null) currentStudent = id;
  currentAssignment = null;
  buildDB();
} //END selectStudentDB()


////////////////////////////////////////////////////////////////////////////////
//These fucntions execute upon selection change for assignmetns and students
//They function, basically, as event handlers
function assignmentSelectionChange() {
  //Wipe content sections
  while (contentTop.firstChild) {contentTop.removeChild(contentTop.firstChild);}
  while (contentBottom.firstChild) {contentBottom.removeChild(contentBottom.firstChild);}
  buildAssignmentContent(document.getElementById('assignmentSelect').value);
} //END assignmentSelectionChange()
function studentSelectionChange() {
  //Wipe content sections
  while (contentTop.firstChild) {contentTop.removeChild(contentTop.firstChild);}
  while (contentBottom.firstChild) {contentBottom.removeChild(contentBottom.firstChild);}
  buildStudentContent(document.getElementById('studentSelect').value);
} //END studentSelectionChange()


////////////////////////////////////////////////////////////////////////////////
//buildOverviewContent()
function buildOverviewContent() {
  // console.log("Build overview executing");

  currentAssignment = null;
  currentStudent = null;

  //Load google chart type
  google.charts.load("current", {packages:['corechart', 'treemap']});

  //Top left (00) for number circles - topics & total posts
  var box00 = document.createElement('div');
  box00.setAttribute("class", "col-md-2");
  contentTop.appendChild(box00);
  //Top left (01) for number circles
  var box01 = document.createElement('div');
  box01.setAttribute("class", "col-md-2");
  contentTop.appendChild(box01);
  //Top mid (02) for day of week histogram
  var box02 = document.createElement('div');
  box02.setAttribute("class", "col-md-5");
  contentTop.appendChild(box02);
  //Top right (03) for student specifics
  var box03 = document.createElement('div');
  box03.setAttribute("class", "col-md-3");
  contentTop.appendChild(box03);
  //Bottom left (10) for volume of posts by topic
  var box10 = document.createElement('div');
  box10.setAttribute("class", "col-md-6");
  box10.setAttribute("style", "width: 100%; height: 300px;")
  contentBottom.appendChild(box10);
  //Bottom right (11) for volume of posts by student
  var box11 = document.createElement('div');
  box11.setAttribute("class", "col-md-6");
  box11.setAttribute("style", "width: 100%; height: 300px;")
  contentBottom.appendChild(box11);

  //Number Circles--------------------------------------------------------------
  //Total number of Topics/Assignments
  var topicCircle = document.createElement('div');
  topicCircle.setAttribute("class", "numberCircle");
  var topicText = document.createElement('span');
  topicText.setAttribute("class", "sizeOneTransp");
  topicText.innerHTML = "Topics<br />";
  topicCircle.appendChild(topicText);
  var topicCount = document.createElement('b');
  topicCount.innerHTML = assignments.length;
  topicCircle.appendChild(topicCount);
  box00.appendChild(topicCircle);
  box00.appendChild(document.createElement('br'));
  //Total number of posts
  var postsCircle = document.createElement('div');
  postsCircle.setAttribute("class", "numberCircle");
  var postsText = document.createElement('span');
  postsText.setAttribute("class", "sizeOneTransp");
  postsText.innerHTML = "Posts<br />";
  postsCircle.appendChild(postsText);
  var postsCount = document.createElement('b');
  postsCount.innerHTML = posts.length;
  postsCircle.appendChild(postsCount);
  box00.appendChild(postsCircle);
  //Total number of students
  var studentsCircle = document.createElement('div');
  studentsCircle.setAttribute("class", "numberCircle");
  var studentsText = document.createElement('span');
  studentsText.setAttribute("class", "sizeOneTransp");
  studentsText.innerHTML = "Students<br />";
  studentsCircle.appendChild(studentsText);
  var studentsCount = document.createElement('b');
  studentsCount.innerHTML = students.length;
  studentsCircle.appendChild(studentsCount);
  box01.appendChild(studentsCircle);
  box01.appendChild(document.createElement('br'));
  //Average number of posts per student
  var postsPerStudent = 0;
  for (var i = 0; i < students.length; i++) {
    postsPerStudent += students[i][1];
  }
  postsPerStudent = postsPerStudent / students.length;
  var ppsCircle = document.createElement('div');
  ppsCircle.setAttribute("class", "numberCircle");
  var ppsText = document.createElement('span');
  ppsText.setAttribute("class", "sizeOneTransp");
  ppsText.innerHTML = "Post/Stdt<br />";
  ppsCircle.appendChild(ppsText);
  var ppsCount = document.createElement('b');
  ppsCount.innerHTML = (postsPerStudent).toFixed(1);
  ppsCircle.appendChild(ppsCount);
  box01.appendChild(ppsCircle);

  //Chart of post count by day of week------------------------------------------
  var daysOfWeek = overviewPostsByDay();
  google.charts.setOnLoadCallback(drawDays);
    function drawDays() {
      var daysData = google.visualization.arrayToDataTable(daysOfWeek);
      var daysOptions = {
        title : 'Post Volume by Day',
        titleTextStyle: {
          fontName: 'Montserrat',
          fontSize: 22,
          bold: true
        },
        seriesType: 'bars',
        legend: {position: 'none'}
        };
      var daysChart = new google.visualization.ComboChart(box02);
      daysChart.draw(daysData, daysOptions);
    }

    //Highlight of Students-----------------------------------------------------
    //Top Posting Student(s)
    var topStudentContribHdr = document.createElement('h4');
    topStudentContribHdr.innerHTML = "Highest Posters";
    box03.appendChild(topStudentContribHdr);
    var topStudentContrib = document.createElement('p');
    topStudentContrib.innerHTML = "";
    var postRanks = sortStudentsByNoPosts();
    // postRanks[postRanks.length - 2][1] = postRanks[postRanks.length - 1][1];
    for (var i = postRanks.length - 1; i >= 0; i--) {
      //Add a break if 2nd or greater student in loop
      if (i != postRanks.length - 1) topStudentContrib.innerHTML += "<br />";
      if (i >= 0 && (postRanks[i][1] == postRanks[postRanks.length - 1][1])) {
        topStudentContrib.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;- Student " + postRanks[i][0] + ":&nbsp;&nbsp;";
        topStudentContrib.innerHTML += "<button class=\"textOnly\" onclick=\"selectStudentDB(" +
            postRanks[i][0] + ")\">" + postRanks[i][1] + " posts</button>";
      }
      else break;
    }
    box03.appendChild(topStudentContrib);
    //Bottom Posting Student(s)
    var bottomStudentContribHdr = document.createElement('h4');
    bottomStudentContribHdr.innerHTML = "Lowest Posters";
    box03.appendChild(bottomStudentContribHdr);
    var bottomStudentContrib = document.createElement('p');
    bottomStudentContrib.innerHTML = "";
    // postRanks[1][1] = postRanks[0][1];
    for (var i = 0; i < postRanks.length; i++) {
      //Add a break if 2nd or greater student in loop
      if (i > 0) bottomStudentContrib.innerHTML += "<br />";
      if ((i < postRanks.length) && (postRanks[i][1] == postRanks[0][1])) {
        bottomStudentContrib.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;- Student " + postRanks[i][0] + ":&nbsp;&nbsp;";
        bottomStudentContrib.innerHTML += "<button class=\"textOnly\" onclick=\"selectStudentDB(" +
            postRanks[i][0] + ")\">" + postRanks[i][1] + " posts</button>";
      }
      else break;
    }
    box03.appendChild(bottomStudentContrib);
    //Most Generating Student(s)
    var mostGeneratingHdr = document.createElement('h4');
    mostGeneratingHdr.innerHTML = "Most Replied To";
    box03.appendChild(mostGeneratingHdr);
    var mostGenerating = document.createElement('p');
    mostGenerating.innerHTML = "";
    postRanks.sort(function(a, b) {return b[2] - a[2];});
    // postRanks[1][2] = postRanks[0][2];
    for (var i = 0; i < postRanks.length; i++) {
      //Add a break if 2nd or greater student in loop
      if (i > 0) mostGenerating.innerHTML += "<br />";
      if ((i < postRanks.length) && (postRanks[i][2] == postRanks[0][2])) {
        mostGenerating.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;- Student " + postRanks[i][0] + ":&nbsp;&nbsp;";
        mostGenerating.innerHTML += "<button class=\"textOnly\" onclick=\"selectStudentDB(" +
            postRanks[i][0] + ")\">" + postRanks[i][2] + " posts</button>";
      }
      else break;
    }
    box03.appendChild(mostGenerating);

    //Volume of posts by Assignment---------------------------------------------
    var assignPostAvg = 0;
    for (var i = 0; i < assignments.length; i++) assignPostAvg += assignments[i][1];
    assignPostAvg = Math.ceil(assignPostAvg / assignments.length);
    var assignAry = new Array();
    assignAry.push(['Topic', 'Parent', 'Posts', 'Gradient']);
    assignAry.push(['Topics', null, 0, 0]);
    for (var i = 0; i < assignments.length; i++) {
      var tmpName = "Topic " + assignments[i][0];
      assignAry.push([tmpName, 'Topics', assignments[i][1], assignments[i][1]-assignPostAvg]);
    }
    google.charts.setOnLoadCallback(drawTopicVol);
    function drawTopicVol() {
      var data = google.visualization.arrayToDataTable(assignAry);
      var tree = new google.visualization.TreeMap(box10);
      tree.draw(data, {
        title : 'Volume of Posts by Topic',
        titleTextStyle: {
          fontName: 'Montserrat',
          fontSize: 22,
          color: 'white',
          bold: true
        },
        minColor: '#ebebff',
        midColor: '#7676ff',
        maxColor: '#2727ff',
        headerHeight: 15,
        fontColor: 'black',
        showScale: true,
        generateTooltip: generateTooltip
      });
      function generateTooltip(row, size, value) {
        return '<div style="background:#eee; padding:10px; border-style:solid">' +
           size + ' posts</div>';
      }
    }

    //Volume of posts by Student------------------------------------------------
    postsPerStudent = Math.ceil(postsPerStudent);
    var studentAry = new Array();
    studentAry.push(['Student', 'Parent', 'Posts', 'Gradient']);
    studentAry.push(['Students', null, 0, 0]);
    for (var i = 0; i < students.length; i++) {
      var tmpName = "Student " + students[i][0];
      studentAry.push([tmpName, 'Students', students[i][1], students[i][1]-postsPerStudent]);
    }
    google.charts.setOnLoadCallback(drawStudentVol);
    function drawStudentVol() {
      var data = google.visualization.arrayToDataTable(studentAry);
      var tree = new google.visualization.TreeMap(box11);
      tree.draw(data, {
        title : 'Volume of Posts by Student',
        titleTextStyle: {
          fontName: 'Montserrat',
          fontSize: 22,
          color: 'white',
          bold: true
        },
        minColor: '#ebebff',
        midColor: '#7676ff',
        maxColor: '#2727ff',
        headerHeight: 15,
        fontColor: 'black',
        showScale: true,
        generateTooltip: generateTooltip
      });
      function generateTooltip(row, size, value) {
        return '<div style="background:#eee; padding:10px; border-style:solid">' +
           size + ' posts</div>';
      }
    }

} //END buildOverviewContent()


////////////////////////////////////////////////////////////////////////////////
//buildAssignmentContent()
function buildAssignmentContent(assignID) {
  if (currentAssignment == null) currentAssignment = assignID;
  //Set selector to the passed in ID
  var aSelect = document.getElementById('assignmentSelect');
  aSelect.value = currentAssignment;
  //Add Listener to selection box
  aSelect.addEventListener("change", assignmentSelectionChange);

  // console.log("Build assignment executing");
  // console.log("Assignment ID value: " + currentAssignment);

  //Load google chart type
  google.charts.load("current", {packages:['corechart']});

  //Get avg and median number of posts across all assignments
  var postCounts = getPostCountsPerTopic();
  //Get assignment statistics
  var topicPosts = getAssignmentPosts(currentAssignment);
  //Get the index of the assignments array for this topic
  var assignIndx = 0;
  for (var i = 0; i < assignments.length; i++) {
    assignIndx = i;
    if (assignments[i][0] == currentAssignment) break;
  }

  //Top left (00) for number circles - topics & total posts
  var box00 = document.createElement('div');
  box00.setAttribute("class", "col-md-2");
  contentTop.appendChild(box00);
  //Top left (01) for number circles
  var box01 = document.createElement('div');
  box01.setAttribute("class", "col-md-2");
  contentTop.appendChild(box01);
  //Top mid (02) for day of week histogram
  var box02 = document.createElement('div');
  box02.setAttribute("class", "col-md-6");
  contentTop.appendChild(box02);
  //Top right (03) for student specifics
  var box03 = document.createElement('div');
  box03.setAttribute("class", "col-md-2");
  contentTop.appendChild(box03);
  //Bottom left (10) for volume of posts by topic
  var box10 = document.createElement('div');
  box10.setAttribute("class", "col-md-4");
  box10.setAttribute("style", "width: 100%; height: 300px;")
  contentBottom.appendChild(box10);
  //Bottom right (11) for volume of posts by student
  var box11 = document.createElement('div');
  box11.setAttribute("class", "col-md-8");
  box11.setAttribute("style", "width: 100%; height: 300px;")
  contentBottom.appendChild(box11);


  //Link to Structure page
  localStorage.setItem('typeParam', "topic");
  localStorage.setItem('idParam', currentAssignment);
  document.getElementById('link_space').innerHTML= "<span class=\"text-center\"><a href=\"./structure.html\" target=\"_blank\">View Topic Post Structure</a></span>";


  //Number Circles--------------------------------------------------------------
  //All Assignments Identifier
  var allNote = document.createElement('h4');
  allNote.setAttribute("class", "text-center");
  allNote.setAttribute("style", "margin-top: -16px; margin-left: -14px;");
  allNote.innerHTML = "ALL";
  box00.appendChild(allNote);
  //Average number of Topics/Assignments across all
  var topicCircle = document.createElement('div');
  topicCircle.setAttribute("class", "numberCircle");
  var topicText = document.createElement('span');
  topicText.setAttribute("class", "sizeOneTransp");
  topicText.innerHTML = "Avg Posts<br />";
  topicCircle.appendChild(topicText);
  var topicCount = document.createElement('b');
  topicCount.innerHTML = postCounts[0];
  topicCircle.appendChild(topicCount);
  box00.appendChild(topicCircle);
  //Median number of posts across all
  var postsCircle = document.createElement('div');
  postsCircle.setAttribute("class", "numberCircle");
  var postsText = document.createElement('span');
  postsText.setAttribute("class", "sizeOneTransp");
  postsText.innerHTML = "Median Posts<br />";
  postsCircle.appendChild(postsText);
  var postsCount = document.createElement('b');
  postsCount.innerHTML = postCounts[1];
  postsCircle.appendChild(postsCount);
  box00.appendChild(postsCircle);
  //Topoic Assignments Identifier
  var assignNote = document.createElement('h4');
  assignNote.setAttribute("class", "text-center");
  assignNote.setAttribute("style", "margin-top: -16px; margin-left: -14px;");
  assignNote.innerHTML = "TOPIC";
  box01.appendChild(assignNote);
  //Total number of posts this topic
  var studentsCircle = document.createElement('div');
  studentsCircle.setAttribute("class", "numberCircleReverse");
  var studentsText = document.createElement('span');
  studentsText.setAttribute("class", "size1P");
  studentsText.innerHTML = "# Posts<br />";
  studentsCircle.appendChild(studentsText);
  var studentsCount = document.createElement('b');
  studentsCount.innerHTML = assignments[assignIndx][1];
  studentsCircle.appendChild(studentsCount);
  box01.appendChild(studentsCircle);
  //Average number of posts per student
  var ppsCircle = document.createElement('div');
  ppsCircle.setAttribute("class", "numberCircleReverse");
  var ppsText = document.createElement('span');
  ppsText.setAttribute("class", "size1P");
  ppsText.innerHTML = "Posts/Stdt<br />";
  ppsCircle.appendChild(ppsText);
  var ppsCount = document.createElement('b');
  ppsCount.innerHTML = getStdtAvgForTopic(topicPosts);
  ppsCircle.appendChild(ppsCount);
  box01.appendChild(ppsCircle);

  //Draw area chart of activity across days
  var areaArr = new Array();
  var maxDays = 0;
  areaArr.push(['Day', 'Topic', 'Average']);
  //Get length of array for bar chart (based on longest active day range of all topics)
  for (var i = 0; i < dayBreakdowns.length; i++) {
    var tmp = Math.abs(dayBreakdowns[i][2] - dayBreakdowns[i][1]);
    tmp = Math.floor(tmp / 86400000);
    if (tmp > maxDays) maxDays = tmp;
  }
  var avgDist = new Array(maxDays);
  var topicIndex = -1;
  for (var i = 0; i < avgDist.length; i++) {avgDist[i] = 0;}
  //Populate the array based on the day of indes (start = 0)
  for (var i = 0; i < dayBreakdowns.length; i++) {
    if (dayBreakdowns[i][0] == currentAssignment) topicIndex = i;
    for (var j = 0; j < dayBreakdowns[i][3].length; j++) {
      var indx = Math.abs(dayBreakdowns[i][3][j][0] - dayBreakdowns[i][1]);
      indx = Math.floor(indx / 86400000);
      avgDist[indx] += dayBreakdowns[i][3][j][1];
    }
  }
  //Divide the values in the array by the total number of posts * 100 for percent
  for (var i = 0; i < avgDist.length; i++) {
    avgDist[i] = (avgDist[i] / posts.length) * 100;
  }
  //Set new array of % specific to the selected topic (dayBreakdowns[topicIndex])
  var topicDist = new Array(maxDays);
  for (var i = 0; i < topicDist.length; i++) {topicDist[i] = 0;}
  for (var i = 0; i < dayBreakdowns[topicIndex][3].length; i++) {
    var indx = Math.abs(dayBreakdowns[topicIndex][3][i][0] - dayBreakdowns[topicIndex][1]);
    indx = Math.floor(indx / 86400000);
    topicDist[indx] += dayBreakdowns[topicIndex][3][i][1];
  }
  for (var i = 0; i < topicDist.length; i++) {
    topicDist[i] = (topicDist[i] / assignments[assignIndx][1]) * 100;
  }
  //Add the data points to the areaArr
  for (var i = 0; i < avgDist.length; i++) {
    areaArr.push([i, topicDist[i], avgDist[i]]);
  }
  google.charts.setOnLoadCallback(drawAreaChart);
  function drawAreaChart() {
    var data = google.visualization.arrayToDataTable(areaArr);
    var options = {
      title: 'Post Activity: % Through Time',
      titleTextStyle: {
        fontName: 'Montserrat',
        fontSize: 18,
        bold: true
      },
      series: {1: {color: 'orange'}},
      legend: {position: 'bottom'}
    };

    var chart = new google.visualization.AreaChart(box11);
    chart.draw(data, options);
  }

  //Days Active Statistics - All Topics
  //Add space to match circles on left
  var allNote = document.createElement('h4');
  allNote.setAttribute("class", "text-center");
  allNote.setAttribute("style", "margin-top: -16px; margin-left: -14px;");
  allNote.innerHTML = "ACTIVE DAYS";
  box03.appendChild(allNote);
  var avgDays = 0;
  for (var i = 0; i < dayBreakdowns.length; i++) {
    var tmp = Math.abs(dayBreakdowns[i][2]-dayBreakdowns[i][1]);
    tmp = Math.ceil(tmp / 86400000);
    avgDays += tmp;
  }
  avgDays = avgDays / dayBreakdowns.length;
  var avgDaysCircle = document.createElement('div');
  avgDaysCircle.setAttribute("class", "numberCircle");
  var avgDaysText = document.createElement('span');
  avgDaysText.setAttribute("class", "sizeOneTransp");
  avgDaysText.innerHTML = "All Avg<br />";
  avgDaysCircle.appendChild(avgDaysText);
  var avgDaysCount = document.createElement('b');
  avgDaysCount.innerHTML = (avgDays).toFixed(1);
  avgDaysCircle.appendChild(avgDaysCount);
  box03.appendChild(avgDaysCircle);
  //Days Active Statistics - This Topic
  var myDays = Math.abs(dayBreakdowns[topicIndex][2]-dayBreakdowns[topicIndex][1]);
  myDays = Math.ceil(myDays / 86400000);
  var thisDaysCircle = document.createElement('div');
  thisDaysCircle.setAttribute("class", "numberCircleReverse");
  var thisDaysText = document.createElement('span');
  thisDaysText.setAttribute("class", "size1P");
  thisDaysText.innerHTML = "Topic<br />";
  thisDaysCircle.appendChild(thisDaysText);
  var thisDaysCount = document.createElement('b');
  thisDaysCount.innerHTML = (myDays).toFixed(0);
  thisDaysCircle.appendChild(thisDaysCount);
  box03.appendChild(thisDaysCircle);

  //Bubble chart about Students to Posts & Replies
  var stData4Topic = getStudentDataForTopic(currentAssignment);
  var bubbleAry = new Array();
  bubbleAry.push(['Id', 'Direct Posts', 'Active Days', 'Student Number', 'Reply Volume']);
  for (var i = 0; i < stData4Topic.length; i++) {
    var tmp = stData4Topic[i][2].getDate() - stData4Topic[i][1].getDate();
    bubbleAry.push([(stData4Topic[i][0]).toFixed(0), stData4Topic[i][3], tmp, (stData4Topic[i][0]).toFixed(0), stData4Topic[i][4]]);
  }
  google.charts.setOnLoadCallback(drawSeriesChart);
  function drawSeriesChart() {
    var data = google.visualization.arrayToDataTable(bubbleAry);
    var options = {
      title: "Days & Post Count vs. Reply Volume",
      titleTextStyle: {
        fontName: 'Montserrat',
        fontSize: 18,
        bold: true
      },
      hAxis: {title: "Count of Student's Posts"},
      vAxis: {
        title: "Active Days",
        viewWindow: {min: 0, max: 31},
      },
      bubble: {textStyle: {fontSize: 11}},
      legend: {position: 'none'}
    };
    var chart = new google.visualization.BubbleChart(box02);
    chart.draw(data, options);
  }

  var charLikeStats = getCharLikeStats();

  //Likes & Character count
  var lcCircles = "<div class=\"row\"><div class=\"col-6\">";
  lcCircles += "<div class=\"numberCircle\"><span class=\"sizeOneTransp\">Avg Chars<br /></span><b>" + (charLikeStats[0]).toFixed(1) + "</b></div>";
  //TODO - insert Char #s
  lcCircles += "<div class=\"numberCircle\"><span class=\"sizeOneTransp\">Avg Likes %<br /></span><b>" + (charLikeStats[2]).toFixed(1) + "</b></div>";
  //TODO - insert number of likes
  lcCircles += "</div><div class=\"col-6\">";
  lcCircles += "<div class=\"numberCircleReverse\"><span class=\"size1P\">Chars/Post<br /></span><b>" + (charLikeStats[1]).toFixed(1) + "</b></div>";
  //TODO - insert Char #s
  lcCircles += "<div class=\"numberCircleReverse\"><span class=\"size1P\">Likes %<br /></span><b>" + (charLikeStats[3]).toFixed(1) + "</b></div>";
  //TODO - insert number of likes
  lcCircles += "</div></div>";
  box10.innerHTML = lcCircles;
  //"<div class=\"numberCircle\"><span class=\"sizeOneTransp\">Avg Chars</span></div></div></div>";

  currentAssignment = null;
  currentStudent = null;
} //END buildAssignmentContent()


////////////////////////////////////////////////////////////////////////////////
//buildStudentContent()
function buildStudentContent(studentID) {
  if (currentStudent == null) currentStudent = studentID;
  //Set selector to the passed in ID
  var sSelect = document.getElementById('studentSelect');
  sSelect.value = currentStudent;
  //Add Listener to selection box
  sSelect.addEventListener("change", studentSelectionChange);

  // console.log("Build student executing");
  // console.log("Student ID value: " + currentStudent);

  //Top left (00) for number circles - topics & total posts
  var box00 = document.createElement('div');
  box00.setAttribute("class", "col-md-2");
  contentTop.appendChild(box00);
  //Top left (01) for number circles
  var box01 = document.createElement('div');
  box01.setAttribute("class", "col-md-2");
  contentTop.appendChild(box01);
  //Top mid (02) for day of week histogram
  var box02 = document.createElement('div');
  box02.setAttribute("class", "col-md-5");
  contentTop.appendChild(box02);
  //Top right (03) for student specifics
  var box03 = document.createElement('div');
  box03.setAttribute("class", "col-md-3");
  contentTop.appendChild(box03);
  //Bottom left (10) for volume of posts by topic
  var box10 = document.createElement('div');
  box10.setAttribute("class", "col-md-6");
  box10.setAttribute("style", "width: 100%; height: 300px;")
  contentBottom.appendChild(box10);
  //Bottom right (11) for volume of posts by student
  var box11 = document.createElement('div');
  box11.setAttribute("class", "col-md-6");
  box11.setAttribute("style", "width: 100%; height: 300px;")
  contentBottom.appendChild(box11);

  //Number Circles--------------------------------------------------------------
  //Average number of posts per topic across all students
  var allAvgCircle = document.createElement('div');
  allAvgCircle.setAttribute("class", "numberCircle");
  var allAvgText = document.createElement('span');
  allAvgText.setAttribute("class", "sizeOneTransp");
  allAvgText.innerHTML = "Avg/Topic<br />";
  allAvgCircle.appendChild(allAvgText);
  var allAvgCount = document.createElement('b');
  allAvgCount.innerHTML = (stdtPostAvg).toFixed(1);
  allAvgCircle.appendChild(allAvgCount);
  box00.appendChild(allAvgCircle);
  box00.appendChild(document.createElement('br'));
  //All Assignments Identifier
  var allStdtNote = document.createElement('h4');
  allStdtNote.setAttribute("class", "text-center");
  allStdtNote.setAttribute("style", "margin-top: -16px; margin-left: -14px;");
  allStdtNote.innerHTML = "ALL";
  box00.appendChild(allStdtNote);
  //Median number of posts per topic across all students
  var allMedCircle = document.createElement('div');
  allMedCircle.setAttribute("class", "numberCircle");
  var allMedText = document.createElement('span');
  allMedText.setAttribute("class", "sizeOneTransp");
  allMedText.innerHTML = "Median/Topic<br />";
  allMedCircle.appendChild(allMedText);
  var allMedCount = document.createElement('b');
  allMedCount.innerHTML = allStdtPostMed;
  allMedCircle.appendChild(allMedCount);
  box00.appendChild(allMedCircle);
  //Average number of posts per topic, this student
  var thisStudentAvg = 0;
  var thisStudentTot = 0;
  var thisStudentMed = 0;
  for (var i = 0; i < stdtPostInfo.length; i++) {
    if (stdtPostInfo[i][0] == currentStudent) {
      for (var j = 0; j < stdtPostInfo[i][1].length; j++) {
        thisStudentAvg += stdtPostInfo[i][1][j][1];
      }
      thisStudentTot = thisStudentAvg;
      thisStudentAvg = thisStudentAvg / stdtPostInfo[i][1].length;
      if (stdtPostInfo[i][1].length % 2 != 0) {
        var tmpIndx = Math.floor(stdtPostInfo[i][1].length / 2);
        thisStudentMed = stdtPostInfo[i][1][tmpIndx][1];
      }
      else {
        var tmpIndx = stdtPostInfo[i][1].length / 2;
        thisStudentMed = stdtPostInfo[i][1][tmpIndx][1];
        thisStudentMed += stdtPostInfo[i][1][tmpIndx - 1][1];
        thisStudentMed = thisStudentMed / 2;
      }
    }
  }
  var avgStudentCircle = document.createElement('div');
  avgStudentCircle.setAttribute("class", "numberCircleReverse");
  var avgStudentText = document.createElement('span');
  avgStudentText.setAttribute("class", "size1P");
  avgStudentText.innerHTML = "Avg/Topic<br />";
  avgStudentCircle.appendChild(avgStudentText);
  var avgStudentCount = document.createElement('b');
  avgStudentCount.innerHTML = (thisStudentAvg).toFixed(1);
  avgStudentCircle.appendChild(avgStudentCount);
  box01.appendChild(avgStudentCircle);
  box01.appendChild(document.createElement('br'));
  //Student Assignments Identifier
  var thisStdtNote = document.createElement('h4');
  thisStdtNote.setAttribute("class", "text-center");
  thisStdtNote.setAttribute("style", "margin-top: -16px; margin-left: -14px;");
  thisStdtNote.innerHTML = "STUDENT";
  box01.appendChild(thisStdtNote);
  //Median number of posts per topic, this student
  var medStudentCircle = document.createElement('div');
  medStudentCircle.setAttribute("class", "numberCircleReverse");
  var medStudentText = document.createElement('span');
  medStudentText.setAttribute("class", "size1P");
  medStudentText.innerHTML = "Median/Topic<br />";
  medStudentCircle.appendChild(medStudentText);
  var medStudentCount = document.createElement('b');
  medStudentCount.innerHTML = (thisStudentMed).toFixed(0);
  medStudentCircle.appendChild(medStudentCount);
  box01.appendChild(medStudentCircle);

  //Post activity across days - student vs overall average
  var stdtDayBreakdown = buildStudentDayDist();
  var areaArr = new Array();
  var maxDays = 0;
  areaArr.push(['Day', 'Student', 'Average']);
  //Get length of array for bar chart (based on longest active day range of all topics)
  for (var i = 0; i < dayBreakdowns.length; i++) {
    var tmp = Math.abs(dayBreakdowns[i][2] - dayBreakdowns[i][1]);
    tmp = Math.floor(tmp / 86400000);
    if (tmp > maxDays) maxDays = tmp;
  }
  var avgDist = new Array(maxDays);
  for (var i = 0; i < avgDist.length; i++) {avgDist[i] = 0;}
  //Populate the array based on the day of index (start = 0)
  for (var i = 0; i < dayBreakdowns.length; i++) {
    for (var j = 0; j < dayBreakdowns[i][3].length; j++) {
      var indx = Math.abs(dayBreakdowns[i][3][j][0] - dayBreakdowns[i][1]);
      indx = Math.floor(indx / 86400000);
      avgDist[indx] += dayBreakdowns[i][3][j][1];
    }
  }
  //Divide the values in the array by the total number of posts * 100 for percent
  for (var i = 0; i < avgDist.length; i++) {
    avgDist[i] = (avgDist[i] / posts.length) * 100;
  }
  //Set new array of % specific to the selected topic (dayBreakdowns[topicIndex])
  var stdtDist = new Array(maxDays);
  for (var i = 0; i < stdtDist.length; i++) {stdtDist[i] = 0;}
  //Populate the array based on the day of index (start = 0)
  for (var i = 0; i < stdtDayBreakdown.length; i++) {
    for (var j = 0; j < stdtDayBreakdown[i][3].length; j++) {
      var indx = Math.abs(stdtDayBreakdown[i][3][j][0] - stdtDayBreakdown[i][1]);
      indx = Math.floor(indx / 86400000);
      stdtDist[indx] += stdtDayBreakdown[i][3][j][1];
    }
  }
  //Divide the values in the array by the total number of posts * 100 for percent
  for (var i = 0; i < stdtDist.length; i++) {
    stdtDist[i] = (stdtDist[i] / thisStudentTot) * 100;
  }
  //Add the data points to the areaArr
  for (var i = 0; i < avgDist.length; i++) {
    areaArr.push([i, stdtDist[i], avgDist[i]]);
  }
  google.charts.setOnLoadCallback(drawAreaChart);
  function drawAreaChart() {
    var data = google.visualization.arrayToDataTable(areaArr);
    var options = {
      title: 'Post Activity: % Through Topics',
      titleTextStyle: {
        fontName: 'Montserrat',
        fontSize: 18,
        bold: true
      },
      series: {1: {color: 'orange'}},
      legend: {position: 'bottom'}
    };

    var chart = new google.visualization.AreaChart(box10);
    chart.draw(data, options);
  }

  //Combo chart of Replies and Discussion Generated
  var comboAry = new Array();
  comboAry.push(['Topic', 'Posts', 'Replies', 'Average']);
  for (var i = 0; i < assignments.length; i++) {
    var studentReplies = 0;
    var studentGen = 0;
    var topicReplyAvg = 0;
    for (var j = 0; j < stdtPostInfo.length; j++) {
      for (var k = 0; k < stdtPostInfo[j][1].length; k++) {
        if (stdtPostInfo[j][1][k][0] == assignments[i][0]) {
          topicReplyAvg += stdtPostInfo[j][1][k][1];
          if (stdtPostInfo[j][0] == currentStudent) {
            studentReplies = stdtPostInfo[j][1][k][1];
            studentGen = stdtPostInfo[j][1][k][2];
          }
        }
      }
    }
    topicReplyAvg = topicReplyAvg / students.length;
    comboAry.push(["T."+(assignments[i][0]).toFixed(0), studentReplies, studentGen, topicReplyAvg]);
  }
  google.charts.setOnLoadCallback(drawComboChart);
  function drawComboChart() {
    var data = google.visualization.arrayToDataTable(comboAry);
    var options = {
    title : 'Discussion Contributions',
    titleTextStyle: {
      fontName: 'Montserrat',
      fontSize: 18,
      bold: true
    },
    seriesType: 'bars',
    series: {2: {type: 'line'}},
    legend: {position: 'bottom'}
    };
    var chart = new google.visualization.ComboChart(box02);
    chart.draw(data, options);
  }

  //Bar chart for days of Week distribution
  var studentDays = [0, 0, 0, 0, 0, 0, 0];
  var avgDays = [0, 0, 0, 0, 0, 0, 0];
  var daysArr = new Array();
  daysArr.push(['Day', 'Student', 'Avgerage']);
  for (var i = 0; i < posts.length; i++) {
    avgDays[posts[i].time.getDay()]++;
    if (posts[i].user == currentStudent){
      studentDays[posts[i].time.getDay()]++;
    }
  }
  for (var i = 0; i < avgDays.length; i++) {
    avgDays[i] = (avgDays[i] / posts.length) * 100;
    studentDays[i] = (studentDays[i] / thisStudentTot) * 100;
  }
  daysArr.push(['Sun', studentDays[0], avgDays[0]]);
  daysArr.push(['Mon', studentDays[1], avgDays[1]]);
  daysArr.push(['Tue', studentDays[2], avgDays[2]]);
  daysArr.push(['Wed', studentDays[3], avgDays[3]]);
  daysArr.push(['Thur', studentDays[4], avgDays[4]]);
  daysArr.push(['Fri', studentDays[5], avgDays[5]]);
  daysArr.push(['Sat', studentDays[6], avgDays[6]]);
  google.charts.setOnLoadCallback(drawDaysChart);
  function drawDaysChart() {
    var data = google.visualization.arrayToDataTable(daysArr);
    var options = {
    title : 'Post Distriubtion: % by Day of Week',
    titleTextStyle: {
      fontName: 'Montserrat',
      fontSize: 18,
      bold: true
    },
    seriesType: 'bars',
    series: {1: {color: 'orange'}},
    legend: {position: 'bottom'},
    vAxis: {
      viewWindow: {min: 0}
    }
    };
    var chart = new google.visualization.ComboChart(box11);
    chart.draw(data, options);
  }

  //Top replies to and topi replies from...
  var topRepToHdr = document.createElement('h4');
  topRepToHdr.innerHTML = "Most Replies To";
  box03.appendChild(topRepToHdr);
  var replyToArr = getStudentRepliesTo();
  var topReplied = document.createElement('p');
  topReplied.innerHTML = "";
  // replyToArr[1][1] = replyToArr[0][1];
  for (var i = 0; i < replyToArr.length; i++) {
    //Add a break if 2nd or greater student in loop
    if (i > 0) topReplied.innerHTML += "<br />";
    if ((i < replyToArr.length) && (replyToArr[i][1] == replyToArr[0][1])) {
      topReplied.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;- Student " + replyToArr[i][0] + ":&nbsp;&nbsp;";
      topReplied.innerHTML += "<button class=\"textOnly\" onclick=\"selectStudentDB(" +
          replyToArr[i][0] + ")\">" + replyToArr[i][1] + " posts</button>";
    }
    else {
      break;
    }
  }
  box03.appendChild(topReplied);

  var topRepFromHdr = document.createElement('h4');
  topRepFromHdr.innerHTML = "Most Replies From";
  box03.appendChild(topRepFromHdr);
  var replyFromArr = getStudentRepliesFrom();
  var topRepliers = document.createElement('p');
  topRepliers.innerHTML = "";
  // replyFromArr[1][1] = replyFromArr[0][1];
  for (var i = 0; i < replyFromArr.length; i++) {
    //Add a break if 2nd or greater student in loop
    if (i > 0) topRepliers.innerHTML += "<br />";
    if ((i < replyFromArr.length) && (replyFromArr[i][1] == replyFromArr[0][1])) {
      topRepliers.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;- Student " + replyFromArr[i][0] + ":&nbsp;&nbsp;";
      topRepliers.innerHTML += "<button class=\"textOnly\" onclick=\"selectStudentDB(" +
          replyFromArr[i][0] + ")\">" + replyFromArr[i][1] + " posts</button>";
    }
    else {
      break;
    }
  }
  box03.appendChild(topRepliers);

  currentStudent = null;
  currentAssignment = null;
} //END buildStudentContent()


////////////////////////////////////////////////////////////////////////////////
//overviewPostsByDay()
function overviewPostsByDay() {
  //days assumes Sunday->Saturday
  var days = [0, 0, 0, 0, 0, 0, 0];
  for (var i = 0; i < posts.length; i++) {
    days[posts[i].time.getDay()]++;
  }
  var result = new Array();
  result.push(["Day", "No. Posts"]);
  result.push(["Sun", days[0]]);
  result.push(["Mon", days[1]]);
  result.push(["Tue", days[2]]);
  result.push(["Wed", days[3]]);
  result.push(["Thur", days[4]]);
  result.push(["Fri", days[5]]);
  result.push(["Sat", days[6]]);

  return result;
} //END overviewPostsByDay()
////////////////////////////////////////////////////////////////////////////////
//sortStudentsByNoPosts()
function sortStudentsByNoPosts() {
  var result = students.slice(0);
  result.sort(function(a, b) {return a[1] - b[1];});
  return result;
} //END sortStudentsByNoPosts()
////////////////////////////////////////////////////////////////////////////////
//getMedianNumPostsPerTopic()
function getPostCountsPerTopic() {
  var result = new Array();
  var total = 0;
  for (var i = 0; i < assignments.length; i++) {
    total += assignments[i][1];
  }
  result.push((total / assignments.length).toFixed(1));
  if (assignments.length % 2 != 0) {
    result.push(assignments[Math.ceil(assignments.length / 2)][1]);
  }
  else {
    var tmp = assignments[assignments.length / 2][1];
    tmp += assignments[assignments.length / 2 - 1][1];
    result.push((tmp / 2).toFixed(0));
  }
  return result;
} //END getMedianNumTopics()
////////////////////////////////////////////////////////////////////////////////
//getAssignmentPosts()
function getAssignmentPosts(topicID) {
  var topicAry = new Array();
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].topicID == topicID) {
      topicAry.push(posts[i]);
    }
  }
  return topicAry;
} //END getAssignmentPosts()
////////////////////////////////////////////////////////////////////////////////
//getStdtAvgForTopic()
function getStdtAvgForTopic(topicAry) {
  var stdtAry = new Array();
  for (var i = 0; i < topicAry.length; i++) {
    var found = false;
    for (var j = 0; j < stdtAry.length; j++) {
      if (topicAry[i].user == stdtAry[j][0]) {
        stdtAry[j][1]++;
        found = true;
        break;
      }
    }
    if (!found) stdtAry.push([topicAry[i].user, 1]);
  }

  var result = 0;
  for (var i = 0; i < stdtAry.length; i++) {
    result += stdtAry[i][1];
  }
  result = result / stdtAry.length;
  return (result).toFixed(1);
} //END getStdtAvgForTopic()
////////////////////////////////////////////////////////////////////////////////
//buildDayDistributions()
function buildDayDistributions() {
  //[topicID, lowDate, highDate, [dateObj, countSeen], peakVol, peakDayIndex];
  var dayDist = new Array();
  for (var i = 0; i < posts.length; i++) {
    var topicFound = false;
    for (var j = 0; j < dayDist.length; j++) {
      //If this topicID exists in dayDist, add values
      if (posts[i].topicID == dayDist[j][0]) {
        topicFound = true;
        var dateFound = false;
        //If this date is lowest, set index 1
        if (posts[i].time < dayDist[j][1]) dayDist[j][1] = posts[i].time;
        //If this date is highest, set index 2
        if (posts[i].time > dayDist[j][2]) dayDist[j][2] = posts[i].time;
        //Check if this date exists in array of index 3; add if not
        for (var k = 0; k < dayDist[j][3].length; k++) {
          if (posts[i].time.getFullYear() == dayDist[j][3][k][0].getFullYear() &&
              posts[i].time.getMonth() == dayDist[j][3][k][0].getMonth() &&
              posts[i].time.getDate() == dayDist[j][3][k][0].getDate()) {
            dateFound = true;
            dayDist[j][3][k][1]++;
            break;
          }
        }
        if (!dateFound) dayDist[j][3].push([posts[i].time, 1]);
        break;
      }
    }
    if (!topicFound) dayDist.push([posts[i].topicID, new Date(2028,1,1,0,0,0,0), new Date(2000,1,1,0,0,0,0), new Array([posts[i].time, 1])]);
  }

  //Sort the date-specific sub array of dayDist
  for (var i = 0; i < dayDist.length; i++) {
    dayDist[i][3].sort(function(a, b) {return a[0] - b[0];});
  }
  // console.log("buildDayDistributions");
  // console.log(dayDist);
  return dayDist;
} //END buildDayDistributions()
////////////////////////////////////////////////////////////////////////////////
//buildStudentDayDist()
function buildStudentDayDist() {
  //[topicID, lowDate, highDate, [dateObj, countSeen]];
  var dayDist = new Array();
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].user != currentStudent) continue;
    var topicFound = false;
    for (var j = 0; j < dayDist.length; j++) {
      //If this topicID exists in dayDist, add values
      if (posts[i].topicID == dayDist[j][0]) {
        topicFound = true;
        var dateFound = false;
        //If this date is lowest, set index 1
        if (posts[i].time < dayDist[j][1]) dayDist[j][1] = posts[i].time;
        //If this date is highest, set index 2
        if (posts[i].time > dayDist[j][2]) dayDist[j][2] = posts[i].time;
        //Check if this date exists in array of index 3; add if not
        for (var k = 0; k < dayDist[j][3].length; k++) {
          if (posts[i].time.getFullYear() == dayDist[j][3][k][0].getFullYear() &&
              posts[i].time.getMonth() == dayDist[j][3][k][0].getMonth() &&
              posts[i].time.getDate() == dayDist[j][3][k][0].getDate()) {
            dateFound = true;
            dayDist[j][3][k][1]++;
            break;
          }
        }
        if (!dateFound) dayDist[j][3].push([posts[i].time, 1]);
        break;
      }
    }
    if (!topicFound) dayDist.push([posts[i].topicID, new Date(2028,1,1,0,0,0,0), new Date(2000,1,1,0,0,0,0), new Array([posts[i].time, 1])]);
  }

  //Sort the date-specific sub array of dayDist
  for (var i = 0; i < dayDist.length; i++) {
    dayDist[i][3].sort(function(a, b) {return a[0] - b[0];});
  }
  // console.log("buildStudentDayDist");
  // console.log(dayDist);
  return dayDist;
} //END buildStudentDayDist()
////////////////////////////////////////////////////////////////////////////////
//getStudentDataForTopic()
function getStudentDataForTopic(topicID) {
  //Index 0 = Student ID, Index 1 = Start Date, Index 2 = End Date, Index 3 = Direct Posts, Index 4 = Reply Posts
  var result = new Array();
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].topicID == topicID) {
      var found = false;
      for (var j = 0; j < result.length; j++) {
        if (result[j][0] == posts[i].user) {
          found = true;
          if (result[j][1] > posts[i].time) result[j][1] = posts[i].time;
          if (result[j][2] < posts[i].time) result[j][2] = posts[i].time;
          result[j][3]++;
          result[j][4] += posts[i].children.length;
          break;
        }
      }
      if (!found) result.push([posts[i].user, posts[i].time, posts[i].time, 1, posts[i].children.length]);
    }
  }
  // console.log("getStudentDataForTopic");
  // console.log(result);
  return result;
} //END getStudentDataForTopic()
////////////////////////////////////////////////////////////////////////////////
//getStudentPostMetrics()
function getStudentPostMetrics() {
  //Index 0 = Student ID, Index 1 = [0-Topic ID, 1-Posts, 2-Replies]
  var result = new Array();
  for (var i = 0; i < posts.length; i++) {
    var studentFound = false;
    for (var j = 0; j < result.length; j++) {
      if (result[j][0] == posts[i].user) {
        studentFound = true;
        var topicFound = false;
        for (var k = 0; k < result[j][1].length; k++) {
          if (result[j][1][k][0] == posts[i].topicID) {
            topicFound = true;
            result[j][1][k][1]++;
            result[j][1][k][2] += posts[i].children.length;
            break;
          }
        }
        if (!topicFound) result[j][1].push([posts[i].topicID, 1, posts[i].children.length]);
        break;
      }
    }
    if (!studentFound) {
      result.push([posts[i].user, [[posts[i].topicID, 1, posts[i].children.length]]]);
    }
  }
  for (var i = 0; i < result.length; i++) {
    result[i][1].sort(function(a, b) {return a[1] - b[1];});
  }
  // console.log("getStudentPostMetrics");
  // console.log(result);
  return result;
} //END getStudentPostMetrics()
////////////////////////////////////////////////////////////////////////////////
//getStudentRepliesTo()
function getStudentRepliesTo() {
  var result = new Array();
  var stdtPosts = new Array();
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].user == currentStudent) stdtPosts.push(posts[i].id);
  }
  for (var i = 0; i < posts.length; i++) {
    for (var j = 0; j < posts[i].children.length; j++) {
      for (var k = 0; k < stdtPosts.length; k++) {
        if (posts[i].children[j] == stdtPosts[k]) {
          var sFound = false;
          for (var m = 0; m < result.length; m++) {
            if (result[m][0] == posts[i].user) {
              result[m][1]++;
              sFound = true;
              break;
            }
          }
          if (!sFound) result.push([posts[i].user, 1]);
          break;
        }
      }
    }
  }
  result.sort(function(a, b) {return b[1] - a[1];});
  // console.log(result);
  return result;
} //END getStudentRepliesTo()
////////////////////////////////////////////////////////////////////////////////
//getStudentRepliesFrom()
function getStudentRepliesFrom() {
  var result = new Array();
  var replies = new Array();
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].user == currentStudent) {
      for (var j = 0; j < posts[i].children.length; j++) {
        replies.push(posts[i].children[j]);
      }
    }
  }
  for (var i = 0; i < posts.length; i++) {
    for (var j = 0; j < replies.length; j++) {
      if (posts[i].id == replies[j]) {
        var sFound = false;
        for (var k = 0; k < result.length; k++) {
          if (result[k][0] == posts[i].user) {
            sFound = true;
            result[k][1]++;
            break;
          }
        }
        if (!sFound) result.push([posts[i].user, 1]);
        break;
      }
    }
  }
  result.sort(function(a, b) {return b[1] - a[1];});
  // console.log(result);
  return result;
} //END getStudentRepliesFrom()
////////////////////////////////////////////////////////////////////////////////
//getCharLikeStats()
function getCharLikeStats() {
  //[AvgCharCntAll, AvgCharCntTopic, AvgLike%All, AvgLike%Topic]
  var result = [0, 0, 0, 0];
  var thisTopicCount = 0;
  for (var i = 0; i < posts.length; i++) {
    //AvgCharCntAll
    result[0] += posts[i].info.textchars;
    //AvgLike%All
    if (posts[i].likes == true) result[2]++;
    //thisTopicCount, AvgCharCntTopic, and AvgLike%Topic
    if (posts[i].topicID == currentAssignment) {
      thisTopicCount++;
      result[1] += posts[i].info.textchars;
      if (posts[i].likes == true) result[3]++;
    }
  }
  result[0] = result[0]/posts.length;
  result[2] = (result[2]/posts.length) * 100;
  result[1] = (result[1]/thisTopicCount);
  result[3] = (result[3]/thisTopicCount) * 100;
  console.log(result);
  return result;
} //END getCharLikeStats()
