const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Gdk = imports.gi.Gdk;
const Clutter = imports.gi.Clutter;
const Cogl = imports.gi.Cogl;
const Soup = imports.gi.Soup;
const ExtensionUtils = imports.misc.extensionUtils;
//const Convenience = Me.imports.convenience;

let parent_container;
let school_food_actor;
let actor;

function getWeekNumber() {
    var d = new Date();
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}

function loadFood() {

}

function init() {}

function enable() {

	var dateMenu = Main.panel.statusArea.dateMenu;
	var parent_container = dateMenu.menu.box.get_children()[0].get_children()[0].get_children()[1].get_children()[2].get_children()[2];

	global.log("bcd "+parent_container.constructor.name);
	global.log("bcd "+parent_container.get_children());

	actor = new St.Button({ style_class: 'weather-button',
                            x_fill: true,
                            can_focus: true });

	school_food_actor = new St.BoxLayout({ style_class: 'weather-box',
                                           vertical: true });

	school_food_actor.add_child(new St.Label({ style_class: 'weather-header',
                                  x_align: Clutter.ActorAlign.START,
                                  text: _("Test") }));

	actor.child = school_food_actor;

	parent_container.add_child(actor);

    dateMenu.menu.connect('open-state-changed', (menu, isOpen) => {
		loadFood();
    });
}

function disable() {
    image_container.destroy();
}
