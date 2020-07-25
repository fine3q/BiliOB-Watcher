<?php //
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package raw
 */

namespace BiliOB;

class Raw
{
    /**
     * turn
     * 处理文件
     */
    public static function turn(string $in, string $out)
    {
        Json::put(
            $out,
            self::proccess(
                Json::read($in)
            )
        );
        Log::success('raw', 'Turning \'' . end(explode('/', $in)) . '\' into \'' . end(explode('/', $out)) . '\'.');
        return;
    }

    /**
     * proccess
     * 处理内容
     */
    private static function proccess(array $raw)
    {
        $return = [];
        foreach ($raw as $class)
            foreach ($class['data'] as $item)
                $return[] = [
                    'name'  => $item['id']['counter'],
                    'show'  => $item['nickName'],
                    'value' => $item['exp'],
                    'date'  => $class['time'],
                    'time'  => date('Y-m-d H:i:s', $item['id']['timeSecond']),
                ];
        return $return;
    }
}
