var currentUserType = "Account Owner";
var optionalUserType = "Visitor";

function editDescription(){
	var descriptionBody = document.getElementById("description-body");
	$("#button-descripion-edit").prop('onclick',null).off('click');
	
	var descriptionForm = document.createElement("form");
	descriptionForm.setAttribute("action", "profile.html");
	
	var textArea = document.createElement("textarea");
	textArea.setAttribute("class", "form-control");
	textArea.setAttribute("id", "description-textarea");
	textArea.setAttribute("rows", "5");
	textArea.value = descriptionBody.innerHTML;
	
	var cancelButton = document.createElement("input");
	cancelButton.setAttribute("class", "btn btn-default");
	cancelButton.setAttribute("type", "submit");
	cancelButton.setAttribute("value", "Cancel");
	
	var saveButton = document.createElement("input");
	saveButton.setAttribute("type", "submit");
	saveButton.setAttribute("class", "btn btn-primary");
	saveButton.setAttribute("value", "Save");

	var buttonGroup = document.createElement("div");
	buttonGroup.setAttribute("class", "text-right");
	
	descriptionBody.innerHTML = "";
	descriptionForm.appendChild(textArea);
	buttonGroup.appendChild(cancelButton);
	buttonGroup.appendChild(saveButton);
	descriptionForm.appendChild(buttonGroup);
	descriptionBody.appendChild(descriptionForm);
}

function switchUserType(){
	if (currentUserType == "Account Owner"){
		currentUserType = "Visitor";
		optionalUserType = "Account Owner";
	}
	else{
		currentUserType = "Account Owner";
		optionalUserType = "Visitor";
	}
	document.getElementById("currentUserType").innerHTML = currentUserType;
	document.getElementById("optionalUserType").innerHTML = optionalUserType;
	updatePage();
}

function updatePage(){
	if (currentUserType == "Account Owner"){
		$(".owner-only").show();
	}
	else{
		$(".owner-only").hide();
	}
}