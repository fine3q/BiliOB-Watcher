<?php if (php_sapi_name() !== 'cli') exit();
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package coumpute
 */

echo "\033[1;37m[" . date('Y-m-d H:i:s') . "] coumpute\tRunning.\n";

require_once __DIR__ . '/lib/Main.php';

define('DIR', __DIR__);

BiliOB\Raw::turn(
    DIR . '/data/full-ranklist.json',
    DIR . '/data/ranklist.json'
);

echo "\033[1;37m[" . date('Y-m-d H:i:s') . "] coumpute\tConstructing.\n";

$compute = new BiliOB\Watcher(
    BiliOB\Json::read(DIR . '/data/ranklist.json')
);

$compute->genHash();
//$compute->limitTime('2020-07-16 00:00', '2020-07-23 00:00');
$compute->formatDate();
$compute->dumpRank();
$compute->dumpVary();
$compute->dumpRegister('2020-01-01');
