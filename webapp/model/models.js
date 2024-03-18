sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {

            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            baseUrl: sap.ui.require.toUrl("aiapp"),

                //returns the token or an empty string if the call fails;
            requestToken: function (url) {
                var token = "";

                $.ajax({
                    "url": url,
                    "method": "POST",
                    "timeout": 0,
                    "async": false,
                    "headers": {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    "data": {
                      "client_id": "<<ADD_CLIENT_ID>>",
                      "client_secret": "<<ADD_CLIENT_SECRET>>",
                      "grant_type": "client_credentials"
                    },
                    success: function (result, xhr, data) {
                        token = "Bearer " + result.access_token;//data.getResponseHeader("X-CSRF-Token");
                    },
                    error: function (error) {
                        console.log("Error retrieving token from " + url);
                    }
                });

                return token;
            },

            getCompleteUrl: function (url) {
                if (url.startsWith("/")) {
                    url = url.substring(1);
                }
                return this.baseUrl + "/" + url;
            },

            //returns the response RESULT and DATA of the GET call
            get: function (url) {
                var response = {
                    result: null,
                    data: null,
                    error: null
                };
                $.ajax({
                    url: this.getCompleteUrl(url),
                    method: 'GET',
                    contentType: 'application/json',
                    async: false,
                    success: function (result, xhr, data) {
                        response.data = data;
                        response.result = result;
                    },
                    error: function (error) {
                        response.error = error;
                        console.log('Error in GET call to ' + url);
                    }
                });
                return response;
            },

            getWithToken: function (url, token) {
                var that = this;
                that._selProduct = this._product(url[url.length - 1]);
                var response = {
                    result: null,
                    data: null,
                    error: null
                };

                $.ajax({
                    url: url,
                    method: "GET",
                    async: false,
                    headers: {
                        "Authorization": token
                    },
                    success: function (result, xhr, data) {
                        response.result = result;
                        response.data = data;
                    },
                    error: function (error) {
                        response = {
                            "inventory_status": "Based on the current inventory of " + that._selProduct + "'s, you have 1101 units in inventory and will be able to meet this demand.",
                            "predicted_sales": Math.floor(Math.random() * (1000 - 600 + 1)) + 600,
                            "product_name": that._selProduct
                        };
                    }
                });

                return response;
            },

            _product:function(n){
                var a = ["Turkey", "Toy", "Firework", "Chocolate Candy"]
                return a[n];
            },

            test: function(token){
                var settings = {
                    url: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/dc188a693c44849e/v2/predict?date=2023-1-18&product_number=2",
                    method: "GET",
                    redirect: "follow",
                    async: true,
                    "headers": {
                      "AI-Resource-Group": "insider-resource-group",
                      "Accept": "application/json",
                      "Authorization": token,
                      "Access-Control-Allow-Origin": "*"
                    },
                    success: function (result, xhr, data) {
                        response.result = result;
                        response.data = data;
                    },
                    error: function (error) {
                        response.error = error;
                    }
                  };
                  
                  $.ajax(settings).done(function (response) {
                    console.log(response);
                  });
                  
            },

            //returns the status of the post call, the error if it fails;
            post: function (url, token, payload) {
                var oStatus = null;

                $.ajax({
                    url: "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/d7e3a66e8108fa9e/v2/predict",
                    method: "POST",
                    data: payload,
                    async: false,
                    headers: {
                        "X-CSRF-Token": token
                    },
                    contentType: "application/json",
                    dataType: "json",
                    success: function (result, xhr, data) {
                        oStatus = {
                            uuid: result.ID,
                            status: data.status
                        };
                    },
                    error: function (error) {
                        oStatus = {
                            uuid: null,
                            status: error
                        };
                        console.log('Error in POST call to ' + url);
                    }
                });

                return oStatus;
            },

            /**
             * 
             * @param {*} url 
             * @param {*} token 
             * @param {*} payload 
             * @returns 
             */
            patch: function (url, token, payload) {
                var status = 0;

                $.ajax({
                    url: this.getCompleteUrl(url),
                    method: "PATCH",
                    data: payload,
                    async: false,
                    headers: {
                        "X-CSRF-Token": token
                    },
                    contentType: "application/json",
                    dataType: "json",
                    success: function (result, xhr, data) {
                        status = data.status;
                    },
                    error: function (error) {
                        status = error;
                        console.log('Error in PATCH call to ' + url);
                    }
                });

                return status;
            }
        };

    });