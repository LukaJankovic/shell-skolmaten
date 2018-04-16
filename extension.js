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

let schedule_indicator;
let parent_container;
let image_container;
let current_hidpi;

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
	var parent_container = dateMenu.menu.box.get_children()[0].get_children()[0].get_children()[1]

	var label = new St.Label({ text: _("test") });
	parent_container.add_chil(label);

    dateMenu.menu.connect('open-state-changed', (menu, isOpen) => {
		loadFood();
    });
}

function disable() {
    image_container.destroy();
}
