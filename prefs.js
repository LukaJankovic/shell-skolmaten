
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const ExtensionUtils = imports.misc.extensionUtils;
const Convenience = Me.imports.convenience;

var provinces;
var districts;
var schools;

var provincesbox;
var districtsbox;
var schoolbox;

var schema;

function init() {

    let json_data = JSON.parse(GLib.file_get_contents(Me.path + '/schools.json')[1]);
	provinces = json_data["provinces"];

    schema = Convenience.getSettings();
}

function province_changed() {
	districts = provinces[provincesbox.get_active()]["districts"];

	districtsbox.remove_all();
	schoolbox.remove_all();

	for (var i = 0; i < districts.length; i++) {
		districtsbox.append_text(districts[i]["name"]);
	}
}

function district_changed() {
	schools = districts[districtsbox.get_active()]["schools"];

	schoolbox.remove_all();

	for (var i = 0; i < schools.length; i++) {
		schoolbox.append_text(schools[i]["name"]);
	}
}

function school_changed() {
    let activeItem = schoolbox.get_active();

    let schoolURL = schools[activeItem]["url"];

    schema.set_string("schoolurl", schoolURL);
}

function buildPrefsWidget() {

    let buildable = new Gtk.Builder();
    buildable.add_objects_from_file(Me.dir.get_path() + '/settings.ui', ['prefs_widget']);

    let rootbox = buildable.get_object('prefs_widget');

	//Initialize boxes
    provincesbox = buildable.get_object('province-list');
	districtsbox = buildable.get_object('district-list');
	schoolbox = buildable.get_object('school-list');

	//School list
    for (var i = 0; i < provinces.length; i++) {
		provincesbox.append_text(provinces[i]["name"]);
    }

    provincesbox.connect("changed", Lang.bind(this, this.province_changed));
	districtsbox.connect("changed", Lang.bind(this, this.district_changed));

    return rootbox;
}
