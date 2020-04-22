//https://jsfiddle.net/mcdowgav/trv9gyda
$.fn.modal = function(state) {
	if (this.length > 1) throw "Modal Error: jQuery Selector too generic; multiple matches.";
	else {
		this.each(function() {
			if (state === 'hide') {
				$(this).off('click');
				$(this).trigger('hide.modal').fadeOut(400, function() {
					$('body').css('overflow', 'auto');
					$(this).trigger('hidden.modal');
				});
			} else {
				$('body').css('overflow', 'hidden');
				$(this).trigger('show.modal').fadeIn(400, function() {
					$(this).trigger('shown.modal');
				});
				$(this).on('click', function(e) {
					if ((!$(this).hasClass('modal-static') && e.target === this) || $(e.target).hasClass('modal-close'))
						$(this).modal('hide');
				});
			}
			return $(this); //Chaining
		});
	}
};
$(document).on('click', '[data-modal-target]', function(e) {
	$($(this).attr("data-modal-target")).modal();
});
