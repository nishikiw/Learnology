$(document).ready(function(){
	$("#checkbox-admin").change(function(){
		$("#link-admin").toggle(this.checked);
	});
});