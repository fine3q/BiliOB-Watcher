<?php if (php_sapi_name() !== 'cli') exit();
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package coumpute
 */
define('DIR', __DIR__);

require_once __DIR__ . '/lib/Main.php';

echo "BiliOB-Watcher\nClient\n";

while (true) {
    echo "\033[1;37m> ";
    $line = fread(STDIN, 1024);
    if (!in_array($line, ['', "\n", "\r\n"]))
        echo "\033[1;37m# " . (string)eval($line) . "\n";
}
