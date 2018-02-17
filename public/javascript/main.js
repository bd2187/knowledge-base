$(document).ready(function() {
    var deleteArticleBtns = [...$('.delete-article')];
   
    deleteArticleBtns.forEach(function(button) {
        $(button).on('click', function() {
            var articleID = $(this).attr('data-id');
            
            $.ajax({
                url: `/article/delete/${articleID}`,
                type: 'DELETE',
                success: function(result) {
                    window.location.href = '/';
                },
                error: function(err) {
                    console.log(err);
                }
            });

        });
    });
});