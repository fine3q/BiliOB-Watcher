<?php //
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package watcher
 */

namespace BiliOB;

class Watcher
{
    /**
     * private variable
     */
    /** @var string */ private $file;
    /** @var array  */ private $data;
    /** @var array  */ private $rank;
    /** @var array  */ private $link;
    /** @var array  */ private $time;
    /** @var array  */ private $vary;

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
     * limitTime
     */
    public function limitTime(string $starttime, string $endtime)
    {
        $starttime = strtotime($starttime);
        $endtime = strtotime($endtime);
        $initial = $this->data;
        $data = [];

        foreach ($initial as $value) {
            $thistime = strtotime($value['date']);
            if ($starttime <= $thistime && $thistime <= $endtime)
                $data[] = $value;
        }

        $this->data = $data;
        return;
    }

    /**
     * saveData
     */
    public function saveData(string $filename)
    {
        return self::genCsvFile($this->data, $filename);
    }

    /**
     * dumpByRank
     */
    public function dumpByRank(string $filename, int $num, int $max)
    {
        $class = [];
        $data = self::divideBy($this->data, 'date');
        foreach ($data as $list) {
            for ($i = 0; $i < $max / $num; $i++) {
                $a = 1 + $num * $i;
                $b = 1 + $num * ($i + 1);
                if (!isset($class[$a])) $class[$a] = [];
                foreach ($list as $index => $item)
                    if (($index + 1) >= $a && ($index + 1) <= $b)
                        $class[$a][] = $item;
            }
        }
        $dump = 0;
        foreach ($class as $value) {
            self::genCsvFile($value, $filename . '-' . $dump);
            $dump++;
        }
        return;
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
    private static function implodeCsv(array $data, array $link, string $endline = "\n", int $date = 0)
    {
        $csv = 'name,show,value,date';
        foreach ($data as $key => $value)
            $csv .= $endline . $key . ',' . $link[$key] . ',' . $value . ',' . $date;
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

    /**
     * genCsvFile
     */
    private static function genCsvFile(array $data, string $filename, string $endline = "\n")
    {
        if (count($data) === 0) return false;
        $csv = implode(',', array_keys($data[0]));
        foreach ($data as $value)
            $csv .= $endline . implode(',', $value);
        return file_put_contents($filename . '.csv', $csv);
    }

    /**
     * divideBy
     */
    private static function divideBy(array $data, string $key)
    {
        $return = [];
        foreach ($data as $value) {
            $keyvalue = $value[$key];
            if (!isset($return[$keyvalue])) $return[$keyvalue] = [];
            $return[$keyvalue][] = $value;
        }
        return $return;
    }
}
