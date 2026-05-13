/*
	Stellar by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$main = $('#main'),
		$nav = $('#nav');

	function getInitialSectionId() {
		var storedId = null;

		try {
			storedId = sessionStorage.getItem('backTarget');
			sessionStorage.removeItem('backTarget');
		}
		catch (error) {}

		if (storedId)
			return storedId;

		if (window.location.hash)
			return decodeURIComponent(window.location.hash.substring(1));

		if (window.location.search.indexOf('section=work') !== -1)
			return 'first';

		if (window.location.search.indexOf('section=projects') !== -1)
			return 'second';

		if (window.location.search.indexOf('section=about') !== -1)
			return 'intro';

		return null;
	}

	function scrollToInitialSection() {
		var id = getInitialSectionId(),
			target = id ? document.getElementById(id) : null;

		if (!target)
			return;

		window.scrollTo({
			top: $(target).offset().top - ($nav.length ? $nav.height() : 0),
			left: 0,
			behavior: 'auto'
		});
	}

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Back links.
		$('a[data-back-target]').on('click', function() {
			try {
				sessionStorage.setItem('backTarget', $(this).attr('data-back-target'));
			}
			catch (error) {}
		});

	// Flip cards.
		$('.flip-card-toggle').on('click', function() {
			var $card = $(this).closest('.flip-card'),
				isFlipped = !$card.hasClass('is-flipped');

			$card.toggleClass('is-flipped', isFlipped);
			$card.find('.flip-card-toggle').attr('aria-pressed', isFlipped);
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);

			scrollToInitialSection();
			window.setTimeout(scrollToInitialSection, 250);
			window.setTimeout(scrollToInitialSection, 750);
		});

	// Nav.
		if ($nav.length > 0) {

			// Shrink effect.
				$main
					.scrollex({
						mode: 'top',
						enter: function() {
							$nav.addClass('alt');
						},
						leave: function() {
							$nav.removeClass('alt');
						},
					});

			// Links.
				var $nav_a = $nav.find('a');

				$nav_a
					.scrolly({
						speed: 1000,
						offset: function() { return $nav.height(); }
					})
					.on('click', function() {

						var $this = $(this);
						var href = $this.attr('href');

						// External link? Bail.
							if (href.charAt(0) != '#')
								return;

						// Deactivate all links.
							$nav_a
								.removeClass('active')
								.removeClass('active-locked');

						// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
							$this
								.addClass('active')
								.addClass('active-locked');

					})
					.each(function() {

						var	$this = $(this),
							id = $this.attr('href'),
							$section = $(id);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: 'middle',
								initialize: function() {

									// Deactivate section.
										if (browser.canUse('transition'))
											$section.addClass('inactive');

								},
								enter: function() {

									// Activate section.
										$section.removeClass('inactive');

									// No locked links? Deactivate all links and activate this section's one.
										if ($nav_a.filter('.active-locked').length == 0) {

											$nav_a.removeClass('active');
											$this.addClass('active');

										}

									// Otherwise, if this section's link is the one that's locked, unlock it.
										else if ($this.hasClass('active-locked'))
											$this.removeClass('active-locked');

								}
							});

					});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000
		});

})(jQuery);
