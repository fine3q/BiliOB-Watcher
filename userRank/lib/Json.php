<?php //
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package csv
 */

namespace BiliOB;

class Json
{
    /**
     * read
     * 读取文件
     */
    public static function read(string $file)
    {
        Log::info('json', 'Reading ' . end(explode('/', $file)) . '.');
        return json_decode(
            file_get_contents($file),
            true
        );
    }

    /**
     * put
     * 存储文件
     */
    public static function put(string $file, array $data)
    {
        Log::info('json', 'Saving ' . end(explode('/', $file)) . '.');
        return file_put_contents(
            $file,
            json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
}
