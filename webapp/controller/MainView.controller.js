sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("zhrfiocico.controller.MainView", {
    onInit: function () {
      this.oModel = this.getOwnerComponent().getModel();
      this.oJsonModel = this.getOwnerComponent().getModel("data");
      var time = this.getCurrentDate();
    },
    onNavBack: function () {
      window.history.go(-1);
    },
    onBusy: function () {
      sap.ui.core.BusyIndicator.show();
    },
    endBusy: function () {
      sap.ui.core.BusyIndicator.hide();
    },
    onClockIn: function () {
      this.onBusy();
      var sMessage = "Arbeitszeit Beginn erfolgreich gebucht. Kommen-Zeit: ";
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("CLOCK_IN");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onClockOut: function () {
      this.onBusy();
      var sMessage = "Arbeitszeit Ende erfolgreich gebucht. Gehen-Zeit: ";
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("CLOCK_OUT");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onPauseBeginn: function () {
      this.onBusy();
      var sMessage = "Pause Beginn erfolgreich gebucht. Beginnzeit: ";
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("PAUSE_START");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onPauseEnde: function () {
      this.onBusy();
      var sMessage = "Pause Ende erfolgreich gebucht. Endezeit: ";
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("PAUSE_END");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onTripBeginn: function () {
      this.onBusy();
      var sMessage = "Dienstgang Beginn erfolgreich gebucht. Beginnzeit: ";
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("TRIP_START");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onTripEnde: function () {
      this.onBusy();
      var sMessage = "Dienstgang Ende erfolgreich gebucht. Endezeit: ";
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("TRIP_END");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    updateService: function (bName) {
      var that = this;
      this.oModel.read("/Aktion" + "('" + bName + "')", {
        success: $.proxy(function (data, resp) {
          that.machPassivButtons(true);
          var ms = resp.data.Time.ms;
          var timeString = that.convertMSToTimeString(ms);
          var sMessage = that.oJsonModel.getProperty("/sMessage") + timeString;
          this.oJsonModel.setProperty("/CurTime", timeString);
          sap.m.MessageBox.show(sMessage, {
            icon: sap.m.MessageBox.Icon.SUCCESS,
            title: "Success",
          });
        }, this),
        error: $.proxy(function (oError) {
          that.machPassivButtons(false);
          var errorObj1 = JSON.parse(error.responseText);
          sap.m.MessageBox.show(errorObj1.error.message.value, {
            icon: sap.m.MessageBox.Icon.ERROR,
            title: "Error",
          });
        }, this),
      });
    },
    convertMSToTimeString: function (ms) {
      let date = new Date(ms);
      let hours = String(date.getUTCHours()).padStart(2, "0");
      let minutes = String(date.getUTCMinutes()).padStart(2, "0");
      let seconds = String(date.getUTCSeconds()).padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    },
    machPassivButtons: function (bError) {
      if (!bError) {
        var state = "Loaded";
      } else {
        state = "Disabled";
      }
      this.oJsonModel.setProperty("/state", state);
    },
    getCurrentDate: function () {
      var currentDate = new Date();

      var hours =
        currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours();
      var minutes =
        currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
      var seconds =
        currentDate.getSeconds() < 10 ? "0" + currentDate.getSeconds() : currentDate.getSeconds();

      var time = hours + ":" + minutes + ":" + seconds;

      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();

      day = day < 10 ? "0" + day : day;
      month = month < 10 ? "0" + month : month;

      var date = day + "." + month + "." + year;

      this.setDateTime(date, time);

      return time;
    },

    setDateTime: function (currentDate, currentTime) {
      this.oJsonModel.setProperty("/CurDate", currentDate);
      this.oJsonModel.setProperty("/CurTime", currentTime);
    },
  });
});
