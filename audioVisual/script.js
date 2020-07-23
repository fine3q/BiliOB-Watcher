/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 * @package audioVisual
 */

/**
 * 生成随机数
 * 
 * @param {number} max 最大值
 * @param {number} min 最小值
 */
const sum = (max, min) => Math.floor(Math.random() * (max - min)) + min;

/**
 * 生成随机 RGB 值
 */
const randomRgbColor = () => {
    var r = sum(0, 255),
        g = sum(0, 255),
        b = sum(0, 255);
    return `rgb(${r},${g},${b})`;
}

config.width = config.multiple * config.width;
config.height = config.multiple * config.height;

$('#casvased').attr('width', config.width)
$('#casvased').attr('height', config.height);
$('#casvased').css('padding', 8 * config.multiple);

var canvas = document.getElementById("casvased");
var canvasCtx = canvas.getContext("2d");

var visual = (e) => audioContext.decodeAudioData(e.target.result, (buffer) => {

    /**
     * AudioBufferSourceNode
     * 用于播放解码出来的buffer的节点
     */
    var audioBufferSourceNode = audioContext.createBufferSource();

    /**
     * AnalyserNode
     * 用于分析音频频谱的节点
     */
    var analyser = audioContext.createAnalyser();

    /**
     * 音频频谱的密集程度
     */
    analyser.fftSize = config.fftSize;

    /**
     * 连接节点,audioContext.destination是音频要最终输出的目标，我们可以把它理解为声卡。
     * 所以所有节点中的最后一个节点应该再连接到audioContext.destination才能听到声音。
     */
    audioBufferSourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
    console.log(audioContext.destination)

    /**
     * 播放音频
     */
    audioBufferSourceNode.buffer = buffer; //回调函数传入的参数
    audioBufferSourceNode.start(); //部分浏览器是noteOn()函数，用法相同

    /**
     * 可视化
     */
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, config.width, config.height);

    function draw() {

        drawVisual = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = config.background;
        canvasCtx.fillRect(0, 0, config.width, config.height);

        var space = 3 * config.multiple;
        var barWidth = config.width / bufferLength - space;
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
            context.fillStyle = config.fill;
            context.strokeStyle = config.fill;
            context.lineJoin = 'round';
            context.lineWidth = r;
            context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
            context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
            context.stroke();
            context.closePath();
        }

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            roundRectColor(
                canvasCtx,
                x,
                config.upsideDown ? config.height - barHeight : 0,
                barWidth,
                barHeight / 255 * (config.height - barWidth * 1.5) + barWidth * 1.5,
                barWidth
            );
            /*
            canvasCtx.fillStyle = config.fill;
            canvasCtx.fillRect(
                x,
                config.upsideDown ? config.height - barHeight : 0,
                barWidth,
                barHeight / 255 * config.height
            );
            */
            x += barWidth + space;
        }

    };
    draw();

});

/**
 * 首先实例化AudioContext对象。
 * audioContext用于音频处理的接口，
 * 并且工作原理是将AudioContext创建出来的各种节点(AudioNode)相互连接，
 * 音频数据流经这些节点并作出相应处理。
 * 总结就一句话 AudioContext 是音频对象，
 * 就像 new Date()是一个时间对象一样。
 */
var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audioContext = new AudioContext();

/**
 * 总结一下接下来的步骤
 * 1 先获取音频文件（目前只支持单个上传）
 * 2 读取音频文件，读取后，获得二进制类型的音频文件
 * 3 对读取后的二进制文件进行解码
 */
$('#musicFile').change(function () {
    $(this).attr('hidden', true);
    if (this.files.length !== 1) return;
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.files[0]);
    fileReader.onload = visual;
})