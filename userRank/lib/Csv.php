<?php //
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package csv
 */

namespace BiliOB;

class Csv
{
    /**
     * gen
     * 生成
     */
    public static function gen(array $data, string $endline = "\n")
    {
        if (count($data) === 0) return false;
        $csv = implode(',', array_keys($data[0]));
        foreach ($data as $value)
            $csv .= $endline . implode(',', $value);
        return $csv;
    }

    /**
     * put
     * 存储
     */
    public static function put(string $file, array $data)
    {
        return file_put_contents(
            $file,
            self::gen($data)
        );
    }

    /**
     * read
     * 读
     */
    public static function read(string $data)
    {
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

        return $csv;
    }
}
