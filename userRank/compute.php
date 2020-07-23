<?php if (php_sapi_name() !== 'cli') exit();
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 */

require_once __DIR__ . '/lib/Watcher.php';

/** @var string */
define('DATA', __DIR__ . '/data/');

if (!isset($argv[1])) exit('Nothing specified.' . "\n");
if (!file_exists(DATA . $argv[1])) exit('File not found.' . "\n");

$compute = new \BiliOB\Watcher(DATA . $argv[1]);
//$compute->dumpVary(DATA . 'dump-vary', 20);
$compute->limitTime('2020-07-16 00:00:00', '2020-07-23 00:00:00');
$compute->dumpByRank(DATA . 'dump-rank', 20, 100);
$compute->dumpVary(DATA . 'dump-vary', 20);
