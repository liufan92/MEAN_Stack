$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);

	$('.carousel').carousel({
      interval: 6000
    })
});

function deleteUser(){
	var confirmation = confirm('Are You Sure?');
		
	if(confirmation){	
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/'+ $(this).data('id')
		})
		window.location.replace('/');
	}else{
		return false;
	}
}


