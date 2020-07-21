<?php if (php_sapi_name() !== 'cli') exit();
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package compute
 */
class Compute
{
    private $file;
    private $data;
    private $rank;
    private $link;
    private $time;
    private $vary;

    /**
     * __construct
     * 
     * @param string $file
     */
    public function __construct($file)
    {
        $this->file = $file;
        $this->getCsvData();
        $this->explodeUser();
        $this->getTimeline();
        $this->getValuevary();
    }

    public function get($variable)
    {
        return isset($this->{$variable}) ?  $this->{$variable} : null;
    }

    /**
     * getCsvData
     */
    private function getCsvData()
    {
        $file = $this->file;
        if (!($data = file_get_contents($file))) {
            $this->data = [];
            return;
        }

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

        $this->data = $csv;
        return;
    }

    /**
     * explodeUser
     */
    private function explodeUser()
    {
        $data = $this->data;
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

        $this->rank = $rank;
        $this->link = $link;
        return;
    }

    /**
     * getTimeline
     */
    private function getTimeline()
    {
        $data = $this->data;
        $time = [];

        foreach ($data as $log) {
            $date = $log['date'];
            if (!in_array($date, $time)) $time[] = $date;
        }
        sort($time);

        $this->time = $time;
        return;
    }

    /**
     * getValuevary
     */
    private function getValuevary()
    {
        $rank = $this->rank;
        $time = $this->time;
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
        arsort($vary);

        $this->vary = $vary;
        return;
    }

    /**
     * separateCsv
     * 
     * @param array $data
     * @param int $num
     * @return array
     */
    public static function separateCsv($data, $num)
    {
        $return = [];
        $count = 0;
        arsort($data);
        foreach ($data as $key => $value) {
            if (!isset($return[$count])) $return[$count] = [];
            $return[$count][$key] = $value;
            if (count($return[$count]) == $num)
                $count++;
        }
        return $return;
    }

    /**
     * implodeCsv
     * 
     * @param array $data
     * @param array $link
     * @param string $endline
     * @return string
     */
    public static function implodeCsv($data, $link, $endline = "\n")
    {
        $csv = 'name,show,value,date';
        foreach ($data as $key => $value) {
            $csv .= $endline . $key . ',' . $link[$key] . ',' . $value . ',0';
        }
        return $csv;
    }

    /**
     * dumpCsvFile
     * 
     * @param array $data
     * @param array $link
     * @param string $filename
     * @param bool $multiple
     * @return void
     */
    public static function dumpCsvFile($data, $link, $filename, $multiple = false)
    {
        if ($multiple) {
        } else {
            file_put_contents($filename . '.csv', self::implodeCsv($data, $link));
        }
    }
}

define('DATA', __DIR__ . '/data/');

if (!isset($argv[1])) exit('Nothing specified.' . "\n");
if (!file_exists(DATA . $argv[1])) exit('File not found.' . "\n");

$compute = new Compute(DATA . $argv[1]);

var_dump($compute->get('vary'));
