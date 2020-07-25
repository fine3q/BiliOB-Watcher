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
    /** @var array  */ private $data;
    /** @var array  */ private $vary;

    /**
     * __construct
     */
    public function __construct(array $data)
    {
        Log::info('watcher', 'BiliOB-Watcher constructed.');
        Log::warning('watcher', 'Loading ' . count($data) . ' items.');
        $this->data = $data;
    }

    /**
     * genHash
     */
    public function genHash()
    {
        foreach ($this->data as $key => $value)
            $this->data[$key]['hash'] = substr(md5(hash('sha256', $value['name'])), 0, 6);
        Log::success('watcher', 'genHash.');
        return;
    }

    /**
     * dumpRank
     */
    public function dumpRank()
    {
        $return = [[], [], [], [], []];
        foreach (self::divideBy($this->data, 'date') as $class)
            for ($i = 0; $i < 5; $i++)
                foreach (self::multiSort($class, 'value') as $index => $item)
                    if (20 * $i <= $index && $index < 20 + 20 * $i)
                        $return[$i][] = $item;
        foreach ($return as $index => $value)
            Csv::put(DIR . "/data/comp-rank-$index.csv", $value);
        Log::success('watcher', 'dumpRank.');
        return;
    }

    /**
     * dumpVary
     */
    public function dumpVary()
    {
        $user = [];
        foreach ($this->data as $value) {
            if (!isset($user[$value['name']]))
                $user[$value['name']] = [
                    'name' => $value['name'],
                    'show' => $value['show'],
                    'startvalue' => null,
                    'endvalue' => null,
                    'time' => $value['time'],
                ];
            if ($user[$value['name']]['startvalue'] === null)
                $user[$value['name']]['startvalue'] = $value['value'];
            $user[$value['name']]['show'] = $value['show'];
            $user[$value['name']]['endvalue'] = $value['value'];
        }
        $vary = [];
        foreach ($user as $value)
            $vary[] = [
                'name' => $value['name'],
                'show' => $value['show'],
                'value' => $value['endvalue'] - $value['startvalue'],
                'date' => '0',
                'time' => $value['time'],
            ];
        $this->vary = $vary;
        $return = [[], [], [], []];
        for ($i = 0; $i < 4; $i++)
            foreach (self::multiSort($vary, 'value') as $index => $item)
                if (20 * $i <= $index && $index < 20 + 20 * $i)
                    $return[$i][] = $item;
        foreach ($return as $index => $value)
            Csv::put(DIR . "/data/comp-vary-$index.csv", $value);
        Log::success('watcher', 'dumpVary.');
        return;
    }

    /**
     * dumpRegister
     */
    public function dumpRegister(string $after)
    {
        $after = strtotime($after);
        $data = $this->data;
        $vary = [];
        foreach ($data as $value) {
            if (strtotime($value['time']) >= $after)
                $vary[] = $value;
        }
        $vary = self::multiSort($vary, 'value');
        Csv::put(DIR . "/data/comp-register.csv", $vary);
        Log::success('watcher', "dumpRegister after $after.");
        return;
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
        Log::success('watcher', "limitTime from $starttime to $endtime.");
        return;
    }

    /**
     * formatDate
     */
    public function formatDate()
    {
        $data = $this->data;
        $return = [];
        foreach ($data as $key => $value) {
            $value['date'] = substr($value['date'], 0, 16);
            $return[$key] = $value;
        }
        $this->data = $return;
        Log::success('watcher', 'formatDate.');
        return;
    }

    /**
     * multiSort
     */
    private static function multiSort(array $data, string $key, bool $asc = false)
    {
        array_multisort(
            array_column($data, $key),
            $asc ? SORT_ASC : SORT_DESC,
            $data
        );
        return $data;
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
