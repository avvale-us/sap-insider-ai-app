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
        
                    const sToken = Models.requestToken("https://23sz1f7-hgwgn184.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials");
                    const oObject = Models.getWithToken("https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/dc188a693c44849e/v2/predict?date=2023-1-18&product_number=" + this.getView().byId("inProductId").getSelectedIndex(), sToken);
                    oModel.setProperty("/inventory_status", oObject.inventory_status);
                    oModel.setProperty("/predicted_sales", oObject.predicted_sales);
                    oModel.setProperty("/product_name", oObject.product_name);
                    oModel.refresh(true);

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
