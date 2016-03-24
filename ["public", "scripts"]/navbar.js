function signin() {
    $("#notFound").css("display","none");
    $("#inputUsername").val("");
    $("#inputPassword").val("");
}

$(document).ready(function(){

    $("#logout_btn").click(function(){
        FB.logout(function(response) {
           document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
        });
    });

    $('[data-toggle="tooltip"]').tooltip(); 
});