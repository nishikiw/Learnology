function signin() {
    $("#login").html("<span class='glyphicon glyphicon-log-out'></span> Logout");
    $("#login").attr("data-target","#logoutModal");
    $("#login").attr("id","logout");
    $("#user").toggle();
    $("#notFound").css("display","none");
    $("#inputUsername").val("");
    $("#inputPassword").val("");
    $('#loginModal').modal('hide');
}

$(document).ready(function(){
    $("#login").click(function(){
        $("#notFound").css("display","none");
    });

    $("#signup").click(function(){
        $('#loginModal').modal('hide');
        $('#signupModal').modal('show');
    });

    $("#signin").click(function(){
        $('#signupModal').modal('hide');
        $("#notFound").css("display","none");
        $('#loginModal').modal('show');
    });

    $("#logout").click(function(){
        $('#logoutModal').modal('show');
    });

    $("#logout_btn").click(function(){
        FB.logout(function(response) {
           document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
        });
        $("#logout").html("<span class='glyphicon glyphicon-log-in'></span> Login/Sign Up");
        $("#logout").attr("data-target","#loginModal");
        $("#logout").attr("id","login");
        $("#user").toggle();
        $('#logoutModal').modal('hide');
    });

    $("#submit").click(function(){
    	if ($("#inputUsername").val() == "JohnSmith" && $("#inputPassword").val() == "password") {
    		$("#login").html("<span class='glyphicon glyphicon-log-out'></span> Logout");
            $("#login").attr("data-target","#logoutModal");
            $("#login").attr("id","logout");
            $("#user").toggle();
            $("#notFound").css("display","none");
            $("#inputUsername").val("");
            $("#inputPassword").val("");
            $('#loginModal').modal('hide');
    	}
    	else {
    		$("#notFound").css("display","block");
    	}
    });

    $("#view").click(function(){
    	if ($(this).text() == "USER VIEW") {
    		$(this).text("ADMIN VIEW");
    		$(".navbar").css("background-color", "#1A0033"); 
    	}
    	else {
    		$(this).text("USER VIEW");
    		$(".navbar").css("background-color", "#222"); 
    	}
    });

    $('[data-toggle="tooltip"]').tooltip(); 

    $('.search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        
        var searchBy = $(this).text();

        $('.search-panel span#search_by').text(searchBy);

        $('.input-group #search_param').val(searchBy);
    });
});