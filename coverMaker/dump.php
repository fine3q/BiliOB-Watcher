<?php

use Grafika\Color;
use Grafika\Grafika;

$file = isset($argv[1]) ? $argv[1] : __DIR__ . '/data/2020-09-20 12-52-13.mp4';

require_once __DIR__ . '/vendor/autoload.php';

$ffmpeg = FFMpeg\FFMpeg::create();

$video = $ffmpeg->open($file);

$video
    ->frame(FFMpeg\Coordinate\TimeCode::fromSeconds(rand(30, 60)))
    ->save('data/frame.jpg');

exec('python blur.py');

$editor = Grafika::createEditor();
$background = Grafika::createBlankImage(1146, 716);
$white = new Color('ffffff');

$editor->fill($background, $white);
$editor->open($blur, 'data/blur.jpg');
$editor->open($text, 'src/text.png');
$editor->resizeExactWidth($blur, 1146);
$editor->blend($background, $blur, 'normal', 1.0, 'top-left', 0, 38);
$editor->blend($background, $text);

$editor->save($background, 'data/cover.jpg');
