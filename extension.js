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
const Pango = imports.gi.Pango;
const Convenience = Me.imports.convenience;

let parent_container;
let root_actor;
let school_food_actor;
let school_food_text;

function getWeekNumber() {
    var d = new Date();
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}

function loadFood() {

	const URL = "https://skolmaten.se/berzeliusskolan/?fmt=json";

	let session = new Soup.SessionAsync();
	Soup.Session.prototype.add_feature.call(session, new Soup.ProxyResolverDefault());

	let request = Soup.Message.new_from_uri('GET', new Soup.URI(URL));

	session.queue_message(request, ((session, message) => {
		if (message.status_code == 200) {

			let response_data = JSON.parse(message.response_body.data);
			let day = new Date().getDay() - 1;

			let string_response = response_data["weeks"][0]["days"][day]["items"].join("\n").replace(/\([^)]*\)/g, "");
			school_food_text.set_text(_(string_response));
		}
	}));
}

function init() {}

function enable() {

	var dateMenu = Main.panel.statusArea.dateMenu;
	var parent_container = dateMenu.menu.box.get_children()[0].get_children()[0].get_children()[1].get_children()[2].get_children()[2];

	//Yes I'm stealing the weather style classes but shh might fix some day
	root_actor = new St.Button({ style_class: 'weather-button',
                            x_fill: true,
                            can_focus: true });

	school_food_actor = new St.BoxLayout({ style_class: 'weather-box',
                                           vertical: true });

	school_food_actor.add_child(new St.Label({ style_class: 'weather-header',
                                  x_align: Clutter.ActorAlign.START,
                                  text: _("School Food") }));

	school_food_text = new St.Label({ style_class: 'weather-conditions',
									  x_align: Clutter.ActorAlign.START });
	school_food_text.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
	school_food_text.clutter_text.line_wrap = true;

	school_food_text.set_text(_("Lorem Ipsum"));

	school_food_actor.add_child(school_food_text);

	root_actor.child = school_food_actor;

	parent_container.add_child(root_actor);

    dateMenu.menu.connect('open-state-changed', (menu, isOpen) => {
		loadFood();
    });
}

function disable() {
    root_actor.destroy();
}
