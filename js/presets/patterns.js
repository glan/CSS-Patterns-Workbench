/**
 * © Glan Thomas 2012
 */

define('presets/patterns', function () {
    'use strict';

    var patterns = [
        'background: radial-gradient(50% 50%, transparent, black); background-size: 100px 100px;',
        'background: radial-gradient(50% 50%, black, transparent); background-size: 100px 100px;',
        'background: linear-gradient(45deg, black, transparent); background-size: 100px 100px;',
        'background: radial-gradient(50% 50%, transparent 20%, black 20%, black 40%, transparent 40%); background-size: 100px 100px;',
        'background: linear-gradient(0deg, transparent 40%, black 40%, black 60%, transparent 60%); background-size: 100px 100px;',
        'background: radial-gradient(50% 50%, black 50%, transparent 50%); background-size: 100px 100px;',
        'background: linear-gradient(45deg, black, black 50%, transparent 50%, transparent); background-size: 100px 100px;',
        'background: linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%); background-size: 100px 100px;',
        'background: linear-gradient(26deg, black 25%, transparent 25%) 50% 0, linear-gradient(-26deg, transparent 75%, black 75%) 50% 0; background-size: 100px 100px;'
    ];

    return patterns;
});