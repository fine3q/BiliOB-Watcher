/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @package audioVisual
 */

$('#music').attr('width', audioVisualConfig.width);
$('#music').attr('height', audioVisualConfig.height);

var canvasCtx = document.getElementById("music").getContext("2d");
var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audioContext = new AudioContext();

var audioVisual = (data) => audioContext.decodeAudioData(data, (buffer) => {

    /**
     * AudioBufferSourceNode
     * 用于播放解码出来的 buffer 的节点
     */
    audioBufferSourceNode = audioContext.createBufferSource();

    /**
     * AnalyserNode
     * 用于分析音频频谱的节点
     */
    var analyser = audioContext.createAnalyser();

    /**
     * 音频频谱的密集程度
     */
    analyser.fftSize = audioVisualConfig.fftSize;

    /**
     * 连接节点，audioContext.destination 是音频要最终输出的目标。
     * 所以所有节点中的最后一个节点应该再连接到 audioContext.destination 才能听到声音。
     */
    audioBufferSourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    /**
     * 播放音频
     */
    audioBufferSourceNode.buffer = buffer; //回调函数传入的参数
    audioBufferSourceNode.start(); //部分浏览器是 noteOn() 函数，用法相同

    /**
     * 可视化
     */
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, audioVisualConfig.width, audioVisualConfig.height);

    function draw() {

        drawVisual = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = audioVisualConfig.background;
        canvasCtx.fillRect(0, 0, audioVisualConfig.width, audioVisualConfig.height);

        var space = audioVisualConfig.space * audioVisualConfig.multiple;
        var barWidth = audioVisualConfig.width / bufferLength - space;
        var barHeight;
        var x = 0;

        /**
         * 绘制圆角矩形（纯色填充）
         * 
         * @param {object} context canvasContext
         * @param {number} x x
         * @param {number} y y
         * @param {number} w width
         * @param {number} h height
         * @param {number} r round
         */
        var roundRectColor = (context, x, y, w, h, r) => {
            context.save();
            context.fillStyle = audioVisualConfig.fill;
            context.strokeStyle = audioVisualConfig.fill;
            context.lineJoin = 'round';
            context.lineWidth = r;
            context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
            context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
            context.stroke();
            context.closePath();
        }

        for (var i = 0; i < bufferLength - audioVisualConfig.ignore; i++) {
            barHeight = dataArray[i] / 255 * (audioVisualConfig.height - barWidth * audioVisualConfig.basic) + barWidth * audioVisualConfig.basic;
            roundRectColor(
                canvasCtx,
                x,
                (audioVisualConfig.way === 'top') ? 0 :
                    (audioVisualConfig.way === 'bottom') ? audioVisualConfig.height - barHeight :
                        (audioVisualConfig.height - barHeight) / 2,
                barWidth,
                barHeight,
                audioVisualConfig.round ? barWidth : 0
            );
            x += barWidth + space;
        }

    };
    draw();

});