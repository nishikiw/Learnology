$(document).ready(function(e){
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		
		var searchBy = $(this).text();

		$('.search-panel span#search_by').text(searchBy);

		$('.input-group #search_param').val(searchBy);
	});
});
