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
    /**
     * private variable
     */
    private string $file;
    private array $data;
    private array $rank;
    private array $link;
    private array $time;
    private array $vary;

    /**
     * public function
     */

    /**
     * __construct
     */
    public function __construct(string $file)
    {
        $this->file = $file;
        $this->getCsvData();
        $this->explodeUser();
        $this->getTimeline();
        $this->getValuevary();
    }

    /**
     * get
     */
    public function get(string $variable)
    {
        return isset($this->{$variable}) ?  $this->{$variable} : null;
    }

    /**
     * dumpVary
     */
    public function dumpVary(string $filename, int $num)
    {
        return self::dumpCsvFile(
            self::separateCsv(
                $this->vary,
                $num
            ),
            $this->link,
            $filename,
            true
        );
    }

    /**
     * private function
     */

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
            if ($index == 0)
                $header = explode(',', $line);
            if ($index > 0) {
                $array = [];
                foreach (explode(',', $line) as $key => $value)
                    $array[$header[$key]] = $value;
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
            if (!in_array($date, $time))
                $time[] = $date;
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
                if ($start_value === null)
                    $start_value = $user[$tick];
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
     * private static function
     */

    /**
     * separateCsv
     */
    private static function separateCsv(array $data, int $num)
    {
        $return = [];
        $count = 0;
        arsort($data);
        foreach ($data as $key => $value) {
            if (!isset($return[$count]))
                $return[$count] = [];
            $return[$count][$key] = $value;
            if (count($return[$count]) == $num)
                $count++;
        }
        return $return;
    }

    /**
     * implodeCsv
     */
    private static function implodeCsv(array $data, array $link, string $endline = "\n")
    {
        $csv = 'name,show,value,date';
        foreach ($data as $key => $value)
            $csv .= $endline . $key . ',' . $link[$key] . ',' . $value . ',0';
        return $csv;
    }

    /**
     * dumpCsvFile
     */
    private static function dumpCsvFile(array $data, array $link, string $filename, bool $multiple = false)
    {
        if ($multiple) {
            foreach ($data as $key => $value)
                file_put_contents($filename . '-' . $key . '.csv', self::implodeCsv($value, $link));
        } else {
            file_put_contents($filename . '.csv', self::implodeCsv($data, $link));
        }
    }
}

/** @var string */
define('DATA', __DIR__ . '/data/');

if (!isset($argv[1])) exit('Nothing specified.' . "\n");
if (!file_exists(DATA . $argv[1])) exit('File not found.' . "\n");

$compute = new Compute(DATA . $argv[1]);
$compute->dumpVary(DATA . 'dump-vary', 20);
