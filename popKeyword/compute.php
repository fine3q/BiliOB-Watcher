<?php if (php_sapi_name() !== 'cli') exit();
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package coumpute
 */

echo "\033[1;37m[" . date('Y-m-d H:i:s') . "] coumpute\tRunning.\n";
define('DIR', __DIR__);

require_once __DIR__ . '/../userRank/lib/Main.php';

if (file_exists(DIR . '/data/keyword.raw.json'))
    BiliOB\Zip::create(
        [DIR . '/data/keyword.raw.json'],
        DIR . '/archive/keyword-' . time() . '.zip'
    );

BiliOB\Zip::extract(
    DIR . '/data/keyword.zip',
    DIR . '/data'
);

BiliOB\Keyword::turn(
    DIR . '/data/keyword.raw.json',
    DIR . '/data/keyword.json'
);

BiliOB\Keyword::dumpCsv(
    BiliOB\Json::read(DIR . '/data/keyword.json')
);
