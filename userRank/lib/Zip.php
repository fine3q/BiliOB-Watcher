<?php //
/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @link https://github.com/FlyingSky-CN/BiliOB-Watcher
 * @package zip
 */

namespace BiliOB;

class Zip
{
    static function extract(string $in, string $out)
    {
        $zip = new \ZipArchive;

        if ($zip->open($in) !== true)
            Log::fatal('zip', 'Unable to open the file.');

        Log::info('zip', 'Unarchiving \'' . end(explode('/', $in)) . '\'.');

        $zip->extractTo($out);
        $zip->close();

        return;
    }

    static function create(array $in, string $out)
    {
        $zip = new \ZipArchive();

        Log::info('zip', 'Archiving \'' . end(explode('/', $out)) . '\'.');

        $zip->open($out, \ZipArchive::CREATE);
        foreach ($in as $file)
            $zip->addFile($file);
        $zip->close();

        return;
    }
}
