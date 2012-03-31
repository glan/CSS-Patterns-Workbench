/**
 * © Glan Thomas 2012
 */

define('models/Length', ['vendor/backbone'], function (Backbone) {
    'use strict';

    var regexp = /(-?[0-9]*\.?[0-9]+)(%|px|mm|cm|in|em|rem|en|ex|ch|vm|vw|vh)|(0)/;

    var length = {
        toString : function () {
            return  ((this.getValue() !== null) ? ((this.getValue() !== 0) ? Math.round(this.getValue() * 10000) / 10000 + this.getUnit() : '0') : '');
        },
        setValue : function (v) {
            this.set({'value': 1 * v});
        },
        setUnit : function (u) {
            this.set({'unit': u});
        },
        getValue : function () {
            return this.get('value');
        },
        getUnit : function () {
            return this.get('unit');
        },
        parseLength : function (str) {
            var result = (''+str).match(regexp);
            if (result && result[0] === '0') {
                this.setValue(0);
            } else if (result && result[1] && result[2]) {
                this.setValue(1 * result[1]);
                this.setUnit(result[2]);
            }
            return this;
        },
        normalize : function (len) {
            if (this.unit === '%') {
                return this.getValue() / 100;
            }
            else {
                return this.getValue() / len;
            }
        }
    };

    return Backbone.Model.extend(length);
});