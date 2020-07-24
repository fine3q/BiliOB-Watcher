<?php

use BiliOB\Raw;

if (php_sapi_name() !== 'cli') exit();
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package coumpute
 */

require_once __DIR__ . '/lib/Main.php';

define('DIR', __DIR__);

BiliOB\Raw::turn(
    DIR . '/data/full-ranklist.json',
    DIR . '/data/ranklist.json'
);

$compute = new BiliOB\Watcher(
    BiliOB\Json::read(DIR . '/data/ranklist.json')
);
