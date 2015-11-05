/**
 * JBZoo Helper
 *
 * This file is part of the JBZoo CCK package.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @package   Utils
 * @license   MIT
 * @copyright Copyright (C) JBZoo.com,  All rights reserved.
 * @link      https://github.com/JBZoo/Utils
 * @author    Denis Smetannikov <denis@jbzoo.com>
 */

/**
 * JBZoo Helper with custom js functions
 */
(function (window, document, undefined) {

    "use strict";

    window.JBZoo = {

        DEBUG: false,

        /**
         * Discuss at: http://phpjs.org/functions/number_format/
         * @param number
         * @param decimals
         * @param decPoint
         * @param thousandsSep
         * @returns {string}
         */
        numFormat: function (number, decimals, decPoint, thousandsSep) {

            number = ("" + number).replace(/[^0-9+\-Ee.]/g, '');

            var num        = !isFinite(+number) ? 0 : +number,
                prec       = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                separator  = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
                decimal    = (typeof decPoint === 'undefined') ? '.' : decPoint,
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + (Math.round(n * k) / k).toFixed(prec);
                };

            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            var result = (prec ? toFixedFix(num, prec) : '' + Math.round(num)).split('.');

            if (result[0].length > 3) {
                result[0] = result[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, separator);
            }

            return result.join(decimal);
        },

        /**
         * Check is variable empty
         * @link http://phpjs.org/functions/empty:392
         * @param mixedVar
         * @return {Boolean}
         */
        empty: function (mixedVar) {
            var $this       = this, undef, i, len,
                emptyValues = [undefined, null, false, 0, '', '0'];

            for (i = 0, len = emptyValues.length; i < len; i++) {
                if (mixedVar === emptyValues[i]) {
                    return true;
                }
            }

            if (typeof mixedVar === 'object') {
                if ($this.countProps(mixedVar) === 0) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Count own object properties
         * @param object
         * @returns {number}
         */
        countProps: function (object) {
            var count = 0;
            for (var property in object) {
                if (object.hasOwnProperty(property)) {
                    count++;
                }
            }
            return count;
        },

        /**
         * Check is value in array
         * @param needle
         * @param haystack
         * @param strict
         * @return {Boolean}
         */
        inArray: function (needle, haystack, strict) {

            var found = false, key;

            strict = !!strict;

            for (key in haystack) {
                if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                    found = true;
                    break;
                }
            }

            return found;
        },

        /**
         * Check is string numeric
         * @param mixed
         * @returns {boolean}
         */
        isNumeric: function (mixed) {
            return (typeof(mixed) === 'number' || typeof(mixed) === 'string') && mixed !== '' && !isNaN(mixed);
        },

        /**
         * Parse integer from string
         * Discuss at: http://phpjs.org/functions/intval/
         * @param mixed
         * @returns {Number}
         */
        toInt: function (mixed, base) {
            var type = typeof mixed;

            if (type === 'boolean') {
                return +mixed;

            } else if (type === 'string') {
                mixed   = mixed.replace(/\s/g, '');
                var tmp = parseInt(mixed, base || 10);
                return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;

            } else if (type === 'number' && isFinite(mixed)) {
                return mixed | 0;

            } else {
                return 0;
            }
        },

        /**
         * Discuss at: http://phpjs.org/functions/is_int/
         * @param mixed
         * @returns {boolean}
         */
        isInt: function (mixed) {
            return mixed === +mixed && isFinite(mixed) && !(mixed % 1);
        },

        /**
         * Parse integer from string
         * @param mixed
         * @returns {Number}
         */
        toFloat: function (mixed) {
            //mixed = $.trim(mixed);
            var type = typeof mixed;

            if (type === 'boolean') {
                return +mixed;
            }

            mixed = '' + mixed;
            mixed = mixed.replace(/\s/g, '');
            mixed = mixed.replace(',', '.');
            mixed = (parseFloat(mixed) || 0);
            mixed = this.round(mixed, 9); // hack for numbers like "0.30000000000000004"

            return mixed;
        },

        /**
         * Discuss at: http://phpjs.org/functions/round/
         * @param value
         * @param precision
         * @param mode
         * @returns {number}
         */
        round: function (value, precision, mode) {
            // helper variables
            var base, floorNum, isHalf, sign;

            // making sure precision is integer
            precision |= 0;
            base = Math.pow(10, precision);
            value *= base;

            // sign of the number
            sign     = (value > 0) | -(value < 0);
            isHalf   = value % 1 === 0.5 * sign;
            floorNum = Math.floor(value);

            if (isHalf) {
                mode = mode ? mode.toUpperCase() : 'DEFAULT';
                switch (mode) {
                    case 'DOWN':
                        // rounds .5 toward zero
                        value = floorNum + (sign < 0);
                        break;
                    case 'EVEN':
                        // rouds .5 towards the next even integer
                        value = floorNum + (floorNum % 2 * sign);
                        break;
                    case 'ODD':
                        // rounds .5 towards the next odd integer
                        value = floorNum + !(floorNum % 2);
                        break;
                    default:
                        // rounds .5 away from zero
                        value = floorNum + (sign > 0);
                }
            }

            return (isHalf ? value : Math.round(value)) / base;
        },

        /**
         * @param min
         * @param max
         * @returns {*}
         */
        rand: function (min, max) {
            var $this = this,
                argc  = arguments.length;

            if (argc === 0) {
                min = 0;
                max = 2147483647;

            } else if (argc === 1) {
                throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');

            } else {
                min = $this.toInt(min);
                max = $this.toInt(max);
            }

            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Discuss at: http://phpjs.org/functions/implode/
         * @param glue
         * @param pieces
         * @returns {*}
         */
        implode: function (glue, pieces) {

            var i      = '',
                retVal = '',
                tGlue  = '';

            if (arguments.length === 1) {
                pieces = glue;
                glue   = '';
            }

            if (typeof pieces === 'object') {
                if (Object.prototype.toString.call(pieces) === '[object Array]') {
                    return pieces.join(glue);
                }
                for (i in pieces) {
                    retVal += tGlue + pieces[i];
                    tGlue = glue;
                }
                return retVal;
            }
        },

        /**
         * Discuss at: http://phpjs.org/functions/explode/
         * @param delimiter
         * @param string
         * @param limit
         * @returns {*}
         */
        explode: function (delimiter, string, limit) {

            if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') {
                return null;
            }

            if (delimiter === '' || delimiter === false || delimiter === null) {
                return false;
            }

            if (typeof delimiter === 'function'
                || typeof delimiter === 'object'
                || typeof string === 'function'
                || typeof string === 'object'
            ) {
                return {0: ''};
            }

            if (delimiter === true) delimiter = '1';

            // Here we go...
            delimiter += '';
            string += '';

            var s = string.split(delimiter);

            if (typeof limit === 'undefined') return s;

            // Support for limit
            if (limit === 0) limit = 1;

            // Positive limit
            if (limit > 0) {
                if (limit >= s.length) return s;
                return s.slice(0, limit - 1)
                    .concat([s.slice(limit - 1)
                        .join(delimiter)
                    ]);
            }

            // Negative limit
            if (-limit >= s.length) return [];

            s.splice(s.length + limit);
            return s;
        },

        /**
         * Discuss at: http://phpjs.org/functions/strip_tags/
         * @param input
         * @param allowed
         * @returns {string}
         */
        stripTags: function (input, allowed) {
            allowed = (((allowed || '') + '')
                .toLowerCase()
                .match(/<[a-z][a-z0-9]*>/g) || [])
                .join('');

            var tags               = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi,
                result             = input
                    .replace(commentsAndPhpTags, '')
                    .replace(tags, function ($0, $1) {
                        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                    });

            //result = $.trim(result);

            return result;
        },

        /**
         * Event logger to browser console
         * @param type String
         * @param message String
         * @param vars mixed
         */
        logger: function (type, message, vars) {

            var $this = this;

            if (!$this.DEBUG || typeof console === 'undefined') {
                return false;
            }

            var postfix = "\t\tvars:";

            if (type === 'e') { // error
                vars !== undefined ? console.error(message + postfix, vars) : console.error(message);

            } else if (type === 'w') { // warning
                vars !== undefined ? console.warn(message + postfix, vars) : console.warn(message);

            } else if (type === 'i') { // information
                vars !== undefined ? console.info(message + postfix, vars) : console.info(message);

            } else if (type === 'l') { // log
                vars !== undefined ? console.log(message + postfix, vars) : console.log(message);

            } else {
                vars !== undefined ? console.log(message + postfix, vars) : console.log(message);
            }
        },

        /**
         * Backtrace for debug
         * Function may use dump function for show backtrace as string
         * Work only if environment is "development"
         * @param asString
         */
        trace: function (asString) {
            var $this = this;

            if (!$this.DEBUG || typeof console === 'undefined') {
                return false;
            }

            if ($this.empty(asString)) {
                asString = false;
            }

            var getStackTrace = function () {
                var obj = {};
                Error.captureStackTrace(obj, getStackTrace);
                return obj.stack;
            };

            if (asString) {
                $this.dump(getStackTrace(), 'trace', false);
            } else {
                if (typeof console != 'undefined') {
                    console.trace();
                }
            }
        },

        /**
         * Alias for console log + backtrace
         * For debug only
         * Work only if environment is "development"
         * @param vars mixed
         * @param name String
         * @param showTrace Boolean
         * @return {Boolean}
         */
        dump: function (vars, name, showTrace) {

            // get type
            if (typeof vars === 'string' || typeof vars === 'array') {
                var type = ' (' + typeof(vars) + ', ' + vars.length + ')';
            } else {
                var type = ' (' + typeof(vars) + ')';
            }

            // wrap in vars quote if string
            if (typeof vars === 'string') {
                vars = '"' + vars + '"';
            }

            // get var name
            if (typeof name === 'undefined') {
                name = '...' + type + ' = ';
            } else {
                name += type + ' = ';
            }

            // is show trace in console
            if (typeof showTrace === 'undefined') {
                showTrace = false;
            }

            // dump var
            if (window.parent && window.parent.console && window.parent.console.log) {
                window.parent.console.log(name, vars);
            }

            // show console
            if (showTrace && typeof console.trace != 'undefined') {
                console.trace();
            }

            return true;
        }
    };

})(window, document);
