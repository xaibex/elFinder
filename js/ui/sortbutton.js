"use strict";
/**
 * @class  elFinder toolbar button menu with sort variants.
 *
 * @author Dmitry (dio) Levashov
 **/
$.fn.elfindersortbutton = function(cmd) {
	
	return this.each(function() {
		var fm       = cmd.fm,
			name     = cmd.name,
			c        = 'class',
			disabled = fm.res(c, 'disabled'),
			hover    = fm.res(c, 'hover'),
			item     = 'elfinder-button-menu-item',
			selected = item+'-selected',
			asc      = selected+'-asc',
			desc     = selected+'-desc',
			text     = $('<span class="elfinder-button-text">'+cmd.title+'</span>'),
			button   = $(this).addClass('ui-state-default elfinder-button elfinder-menubutton elfiner-button-'+name)
				.attr('title', cmd.title)
				.append('<span class="elfinder-button-icon elfinder-button-icon-'+name+'"/>', text)
				.hover(function(e) { !button.hasClass(disabled) && button.toggleClass(hover); })
				.click(function(e) {
					if (!button.hasClass(disabled)) {
						e.stopPropagation();
						menu.is(':hidden') && cmd.fm.getUI().click();
						menu.slideToggle(100);
					}
				}),
			menu = $('<div class="ui-front ui-widget ui-widget-content elfinder-button-menu ui-corner-all"/>')
				.hide()
				.appendTo(button)
				.on('mouseenter mouseleave', '.'+item, function() { $(this).toggleClass(hover) })
				.on('click', '.'+item, function(e) {
					e.preventDefault();
					e.stopPropagation();
					hide();
				}),
			update = function() {
				menu.children('[rel]').removeClass(selected+' '+asc+' '+desc)
					.filter('[rel="'+fm.sortType+'"]')
					.addClass(selected+' '+(fm.sortOrder == 'asc' ? asc : desc));

				menu.children('.elfinder-sort-stick').toggleClass(selected, fm.sortStickFolders);
				menu.children('.elfinder-sort-tree').toggleClass(selected, fm.sortAlsoTreeview);
			},
			hide = function() { menu.hide(); };
			
		text.hide();
		
		$.each(fm.sortRules, function(name, value) {
			menu.append($('<div class="'+item+'" rel="'+name+'"><span class="ui-icon ui-icon-arrowthick-1-n"/><span class="ui-icon ui-icon-arrowthick-1-s"/>'+fm.i18n('sort'+name)+'</div>').data('type', name));
		});
		
		menu.children().click(function(e) {
			var type = $(this).attr('rel');
			
			cmd.exec([], {
				type  : type, 
				order : type == fm.sortType ? fm.sortOrder == 'asc' ? 'desc' : 'asc' : fm.sortOrder, 
				stick : fm.sortStickFolders,
				tree  : fm.sortAlsoTreeview
			});
		});
		
		$('<div class="'+item+' '+item+'-separated elfinder-sort-ext elfinder-sort-stick"><span class="ui-icon ui-icon-check"/>'+fm.i18n('sortFoldersFirst')+'</div>')
			.appendTo(menu)
			.click(function() {
				cmd.exec([], {type : fm.sortType, order : fm.sortOrder, stick : !fm.sortStickFolders, tree : fm.sortAlsoTreeview});
			});

		if ($.fn.elfindertree && $.inArray('tree', fm.options.ui) !== -1) {
			$('<div class="'+item+' '+item+'-separated elfinder-sort-ext elfinder-sort-tree"><span class="ui-icon ui-icon-check"/>'+fm.i18n('sortAlsoTreeview')+'</div>')
				.appendTo(menu)
				.click(function() {
					cmd.exec([], {type : fm.sortType, order : fm.sortOrder, stick : fm.sortStickFolders, tree : !fm.sortAlsoTreeview});
				});
		}
		
		fm.bind('disable select', hide).getUI().click(hide);
			
		fm.bind('sortchange', update)
		
		if (menu.children().length > 1) {
			cmd.change(function() {
					button.toggleClass(disabled, cmd.disabled());
					update();
				})
				.change();
			
		} else {
			button.addClass(disabled);
		}

	});
	
};
