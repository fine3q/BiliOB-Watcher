<?php //
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package keyword
 */

namespace BiliOB;

class Keyword {
    /**
     * turn
     * 处理文件
     */
    public static function turn(string $in, string $out)
    {
        Json::put(
            $out,
            self::turnProccess(
                Json::read($in)
            )
        );
        $indir = explode('/', $in);
        $outdir = explode('/', $out);
        Log::success('keyword', 'Turning \'' . end($indir) . '\' into \'' . end($outdir) . '\'.');
        return;
    }

    /**
     * proccess
     * 处理内容
     */
    private static function turnProccess(array $raw)
    {
        $return = [];
        foreach ($raw as $data)
        $return[] = [
            'data' => json_decode($data['data']),
            'time' => $data['time']
        ];
        return $return;
    }

    /**
     * 
     */
    public static function dumpCsv(array $data) {
        $raw = [];
        foreach ($data as $day)
            foreach ($day['data'] as $item)
            $raw[] = [
                'id' => $item['_id'],
                'value' => $item['value'],
                'count' => $item['count'],
                'time' => $day['time']
            ];
        return Csv::put(DIR . "/data/keyword-dump.csv", $raw);
    }
}