/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 */

/**
 * globalData
 * 
 * @var {object}
 */
const global = {
    data: {
        audio: null,
        audioName: null,
        countDown: true,
        snackBar: '',
    },
    check: () => {
        if (global.data.audio === null) return;

        $('#playbutton').attr('disabled', false);
    },
    count: (callback) => {
        let dom = $('#countdown');
        setTimeout(() => {
            dom.text('3');
            setTimeout(() => {
                dom.text('2');
                setTimeout(() => {
                    dom.text('1');
                    setTimeout(() => {
                        dom.text('');
                        $('#count').hide();
                        callback();
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    },
    play: () => {
        $('#music').show();
        audioVisual(global.data.audio)
    }
};

$(document).ready(() => {
    $('#start').fadeIn()
})

$('#playbutton').click(function () {
    $('#start').fadeOut(() => {
        if (global.data.countDown) {
            $('#count').fadeIn(() => {
                global.count(global.play)
            })
        } else {
            global.play()
        }
    })
})

$('#musicFile').change(function () {
    if (this.files.length !== 1) return;
    $(this).attr('disabled', true);
    global.data.audioName = this.files[0].name.replace('.mp3', '');
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.files[0]);
    fileReader.onload = (e) => (console.log(e), global.data.audio = e.target.result, global.check());
})