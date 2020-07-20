<?php if (php_sapi_name() !== 'cli') exit();
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package compute
 */

define('DATA', __DIR__ . '/data/');

if (!isset($argv[1])) exit('Nothing specified.' . "\n");
if (!file_exists(DATA . $argv[1])) exit('File not found.' . "\n");

/**
 * getCsvData
 * 
 * @param string $file
 * @param bool $return
 * @return array
 */
function getCsvData($file)
{
    if (!($data = file_get_contents($file))) return [];

    $endline = strpos($data, "\r") ? "\r\n" : "\n";
    $csv = [];

    foreach (explode($endline, $data) as $index => $line) {
        if ($index == 0) $header = explode(',', $line);
        if ($index > 0) {
            $array = [];
            foreach (explode(',', $line) as $key => $value) {
                $array[$header[$key]] = $value;
            }
            $csv[] = $array;
        }
    }

    return $csv;
}

/**
 * explodeUser
 * 
 * @param array $data
 * @return array
 */
function explodeUser($data)
{
    $rank = [];
    $link = [];

    foreach ($data as $log) {
        $name = (string)$log['name'];
        $show = (string)$log['show'];
        $value = (float)$log['value'];
        $date = (string)$log['date'];

        if (!isset($rank[$name])) $rank[$name] = [];
        $rank[$name][$date] = $value;
        $link[$name] = $show;
    }
    return [$rank, $link];
}

/**
 * getTimeline
 * 
 * @param array $data
 * @return array
 */
function getTimeline($data)
{
    $time = [];
    foreach ($data as $log) {
        $date = $log['date'];
        if (!in_array($date, $time)) $time[] = $date;
    }
    sort($time);
    return $time;
}

/**
 * getValuevary
 * 
 * @param array rank
 * @param array time
 * @return array
 */
function getValuevary($rank, $time)
{
    $vary = [];

    foreach ($rank as $name => $user) {
        $start_value = null;
        $end_value = null;
        foreach ($time as $tick) {
            if (!isset($user[$tick])) continue;
            if ($start_value === null) $start_value = $user[$tick];
            $end_value = $user[$tick];
        }
        if ($start_value === null || $end_value === null) continue;
        $vary[$name] = bcsub($end_value, $start_value, 2);
    }
    return $vary;
}

/**
 * implodeCsv
 * 
 * @param array $data
 * @param array $link
 * @param string $endline
 * @return string
 */
function implodeCsv($data, $link, $endline = "\n")
{
    $csv = 'name,show,value,date';
    foreach ($data as $key => $value) {
        $csv .= $endline . $key . ',' . $link[$key] . ',' . $value . ',0';
    }
    return $csv;
}

$data = getCsvData(DATA . $argv[1]);
list($rank, $link) = explodeUser($data);
$time = getTimeline($data);
$vary = getValuevary($rank, $time);
echo implodeCsv($vary, $link);
