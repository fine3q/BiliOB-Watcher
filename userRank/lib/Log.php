<?php

/**
 * BiliOB Helper
 * 
 * @author FlyingSky-CN
 */

namespace BiliOB;

/**
 * 日志输出
 * 
 * @package Log
 */
class Log
{
    /**
     * 输出 info
     * 
     * @param string $msg 消息内容
     * @return bool
     */
    static function info(String $package, String $msg)
    {
        if (self::check()) return false;
        echo "\033[0;36m[" . date('Y-m-d H:i:s') . "] $package\t$msg\n";
        return true;
    }

    /**
     * 输出 warning
     * 
     * @param string $msg 消息内容
     * @return bool
     */
    static function warning(String $package, String $msg)
    {
        if (self::check()) return false;
        echo "\033[0;33m[" . date('Y-m-d H:i:s') . "] $package\t$msg\n";
        return true;
    }

    /**
     * 输出 success
     * 
     * @param string $msg 消息内容
     * @return bool
     */
    static function success(String $package, String $msg)
    {
        if (self::check()) return false;
        echo "\033[0;32m[" . date('Y-m-d H:i:s') . "] $package\t$msg\n";
        return true;
    }

    /**
     * 输出 error
     * 
     * @param string $msg 消息内容
     * @return bool
     */
    static function error(String $package, String $msg)
    {
        if (self::check()) return false;
        echo "\033[0;31m[" . date('Y-m-d H:i:s') . "] $package\t$msg\n";
        return true;
    }

    /**
     * 输出 fatal
     * 
     * @param string $msg 消息内容
     * @return bool
     */
    static function fatal(String $package, String $msg)
    {
        if (self::check()) return false;
        echo "\033[0;31m[" . date('Y-m-d H:i:s') . "] $package\t$msg\n";
        exit();
        return true;
    }

    private static function check()
    {
        return defined('NoLog') ? true : false;
    }
}
