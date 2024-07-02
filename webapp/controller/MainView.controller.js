sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("zhrfiocico.controller.MainView", {
    onInit: function () {
      this.oModel = this.getOwnerComponent().getModel();
      this.oJsonModel = this.getOwnerComponent().getModel("data");
      var time = this.getCurrentDate();
      this.oJsonModel.setProperty("/time", time);
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
      var time = this.oJsonModel.getProperty("/time");
      var sMessage = "Arbeitszeit Beginn erfolgreich gebucht. Kommen-Zeit: " + time;
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("CLOCK_IN");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onClockOut: function () {
      this.onBusy();
      var time = this.oJsonModel.getProperty("/time");
      var sMessage = "Arbeitszeit Ende erfolgreich gebucht. Gehen-Zeit: " + time;
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("CLOCK_OUT");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onPauseBeginn: function () {
      this.onBusy();
      var time = this.oJsonModel.getProperty("/time");
      var sMessage = "Pause Beginn erfolgreich gebucht. Beginnzeit: " + time;
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("PAUSE_START");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onPauseEnde: function () {
      this.onBusy();
      var time = this.oJsonModel.getProperty("/time");
      var sMessage = "Pause Ende erfolgreich gebucht. Endezeit: " + time;
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("PAUSE_END");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onTripBeginn: function () {
      this.onBusy();
      var time = this.oJsonModel.getProperty("/time");
      var sMessage = "Dienstgang Beginn erfolgreich gebucht. Beginnzeit: " + time;
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("TRIP_START");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    onTripEnde: function () {
      this.onBusy();
      var time = this.oJsonModel.getProperty("/time");
      var sMessage = "Dienstgang Ende erfolgreich gebucht. Endezeit: " + time;
      this.oJsonModel.setProperty("/sMessage", sMessage);
      this.updateService("TRIP_END");
      this.machPassivButtons(this.err);
      this.endBusy();
    },
    updateService: function (bName) {
      var that = this;
      var oEntry = {
        Aksionname: bName,
        Messagetyp: "",
        Message: "",
      };
      this.oModel.update("/Aktion" + "('" + bName + "')", oEntry, {
        success: function () {
          that.machPassivButtons(true);
          var sMessage = that.oJsonModel.getProperty("/sMessage");
          //   sap.m.MessageBox.success(sMessage, sap.m.MessageBox.Icon.SUCCESS);
          sap.m.MessageBox.show(sMessage, {
            icon: sap.m.MessageBox.Icon.SUCCESS,
            title: "Success",
          });
        },
        error: function (error) {
          that.machPassivButtons(false);
          var errorObj1 = JSON.parse(error.responseText);
          sap.m.MessageBox.show(errorObj1.error.message.value, {
            icon: sap.m.MessageBox.Icon.ERROR,
            title: "Error",
          });
        },
      });
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
