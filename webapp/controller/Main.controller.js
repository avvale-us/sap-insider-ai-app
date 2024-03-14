sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "aiapp/model/models",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Models) {
        "use strict";

        return Controller.extend("aiapp.controller.Main", {
            onInit: function () {

                var oPredict = new JSONModel({
                    product_id: '',
                    future_date: ''
                });
                this.getView().setModel(oPredict);

            },

            onPressPredict: function (oEvent) {
                var oModel = this.getView().getModel(),
                    oData = oModel.getData();

                    let oPayload = {
                        "product_id": 1,
                        "future_date": "2023-07-03"
                    };
        
                    const sToken = Models.requestToken("AI/v2/inference/deployments/d7e3a66e8108fa9e/v2/predict");
                    const oStatus = Models.post("AI/v2/inference/deployments/d7e3a66e8108fa9e/v2/predict", sToken, JSON.stringify(oPayload));
                    //this.getOwnerComponent().getModel("aux").setProperty("/headerUUID", oStatus.uuid);
                    return oStatus;

            },


            _convertDate: function (oDate) {
                // Get current date
                var currentDate = oDate ? oDate : new Date();                

                // Get year, month, and day
                var year = currentDate.getFullYear();
                var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                var day = currentDate.getDate().toString().padStart(2, '0');

                // Assemble the formatted date string
                var formattedDate = year + '-' + month + '-' + day;

                console.log(formattedDate); // Output the formatted date
                return formattedDate;
            }
        });
    });
