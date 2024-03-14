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
                    url: this.getCompleteUrl(url),
                    method: "GET",
                    async: false,
                    headers: {
                        "X-CSRF-Token": "Fetch",
                    },
                    success: function (result, xhr, data) {
                        token = data.getResponseHeader("X-CSRF-Token");
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
                var response = {
                    result: null,
                    data: null,
                    error: null
                };

                $.ajax({
                    url: this.getCompleteUrl(url),
                    method: "GET",
                    async: false,
                    headers: {
                        "X-CSRF-Token": token
                    },
                    success: function (result, xhr, data) {
                        response.result = result;
                        response.data = data;
                    },
                    error: function (error) {
                        response.error = error;
                    }
                });

                return response;
            },

            //returns the status of the post call, the error if it fails;
            post: function (url, token, payload) {
                var oStatus = null;

                $.ajax({
                    url: this.getCompleteUrl(url),
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