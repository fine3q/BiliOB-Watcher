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

BiliOB\Raw::turn(
    __DIR__ . '/data/full-ranklist.json',
    __DIR__ . '/data/ranklist.json'
);
