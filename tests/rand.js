/**
 * JBZoo Helper
 *
 * This file is part of the JBZoo CCK package.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @package   JS-Utils
 * @license   MIT
 * @copyright Copyright (C) JBZoo.com,  All rights reserved.
 * @link      https://github.com/JBZoo/JS-Utils
 * @author    Denis Smetannikov <denis@jbzoo.com>
 */

(function () {
    "use strict";

    var helper = window.JBZoo;

    describe("rand", function () {
        it("rand", function () {
            expect(helper.rand(1, 1)).toBe(1);
            expect(helper.rand()).toBeGreaterThan(0);
            expect(helper.rand(51, 52)).toBeGreaterThan(50);
            expect(helper.rand(51, 52)).toBeLessThan(53);
            expect(function () {
                helper.rand(1);
            }).toThrow(new Error("Warning: rand() expects exactly 2 parameters, 1 given"));
        });
    });

}).call(this);
