/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zhr_fio_cico/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
