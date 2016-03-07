// Reference: https://github.com/twbs/bootstrap/issues/3316
// Rating Reference: http://jsfiddle.net/Phoennix/6Sybq/4/

var currentUserType;

$(document).ready(function(){
	var offset = 55;

	$('.nav-pills li a, .rating a').click(function(event) {
		event.preventDefault();
		$($(this).attr('href'))[0].scrollIntoView();
		scrollBy(0, -offset);
	});
		
	$("#optionalUserType1").click(function(){
		currentUserType = $("#optionalUserType1").text();
		$("#optionalUserType1").text($("#currentUserType").text());
		$("#currentUserType").text(currentUserType);
		$("#currentUserType").append("<span class='caret'></span>");
		updatePage();
	});
	
	$("#optionalUserType2").click(function(){
		currentUserType = $("#optionalUserType2").text();
		$("#optionalUserType2").text($("#currentUserType").text());
		$("#currentUserType").text(currentUserType);
		$("#currentUserType").append("<span class='caret'></span>");
		updatePage();
	});
});

function updatePage(){
	switch (currentUserType){
		case "Instructor ":
			$("#course-control").text("Edit Course");
			$("#course-control").attr("class", "btn btn-default col-sm-offset-10 btn-lg pull-right");
			$("#form-review").hide();
			$("#login span").attr("class", "glyphicon-log-out");
			$("#login").text(" Log Out");
			$("#account-link").show();
			$("#account-link").text("");
			$("#account-link").append("<span class='glyphicon glyphicon-user'></span> tvaillant");
			break;
		case "Student ":
			$("#course-control").text("Drop Course");
			$("#course-control").attr("class", "btn btn-danger col-sm-offset-10 btn-lg pull-right");
			$("#form-review").show();
			$("#login span").attr("class", "glyphicon-log-out");
			$("#login").text(" Log Out");
			$("#account-link").show();
			$("#account-link").text("");
			$("#account-link").append("<span class='glyphicon glyphicon-user'></span> naruto");
			break;
		case "Visitor ":
			$("#course-control").text("Join Course");
			$("#course-control").attr("class", "btn btn-success col-sm-offset-10 btn-lg pull-right");
			$("#form-review").hide();
			$("#login span").attr("class", "glyphicon-log-in");
			$("#login").text(" Login/Sign Up");
			$("#account-link").hide();
			break;
	}
}