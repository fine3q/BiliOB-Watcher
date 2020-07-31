/**
 * BiliOB-Watcher
 * 
 * @author FlyingSky-CN
 */

dataVisualConfig.max_number = 20;
dataVisualConfig.auto_sort = true;
dataVisualConfig.itemLabel = "BiliOB 观测者排行榜";
dataVisualConfig.typeLabel = '';
dataVisualConfig.interval_time = .5;
dataVisualConfig.text_x = 1400;
dataVisualConfig.format = ",.1f";
dataVisualConfig.dateLabel_x = 725;
dataVisualConfig.dateLabel_y = -50;
dataVisualConfig.allow_up = true;
dataVisualConfig.bar_name_max = 12;

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
        startTime: null,
        userRank: {
            rank: [null, null, null, null, null],
            register: null,
            very: [null, null, null, null]
        }
    },
    check: () => {
        //if (global.data.audio === null) return;
        if (global.data.userRank.rank[0] === null) return;
        if (global.data.userRank.rank[1] === null) return;
        if (global.data.userRank.rank[2] === null) return;
        if (global.data.userRank.rank[3] === null) return;
        if (global.data.userRank.rank[4] === null) return;
        if (global.data.userRank.register === null) return;
        if (global.data.userRank.very[0] === null) return;
        if (global.data.userRank.very[1] === null) return;
        if (global.data.userRank.very[2] === null) return;
        if (global.data.userRank.very[3] === null) return;

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
        setTimeout(() => {
            audioVisual(global.data.audio)
        }, 500);
        global.data.startTime = (new Date()).valueOf();
        $('#snackbar').text(global.data.snackBar);
        $('#home').show();
        setTimeout(() => {
            $('#home').fadeOut(() => {
                $('#music').show();
                $('#main').fadeIn(() => {
                    global.playPart.rank1(() => {
                        global.playPart.rank2(() => {
                            global.playPart.rank3(() => {
                                global.playPart.register(() => {
                                    global.playPart.very1(() => {
                                        global.playPart.very2(() => {
                                            $('#main').fadeOut(() => {
                                                global.ending();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }, 5000);
    },
    playPart: {
        rank1: (callback) => {
            $('#svgL').show();
            $('#svgR').show();
            dataVisual(global.data.userRank.rank[0], '#svgL', 0);
            dataVisual(global.data.userRank.rank[1], '#svgR', 20, () => {
                $('#dataVisual').fadeOut(() => {
                    global.playPart.clean();
                    callback();
                });
            });
            $('#dataVisual').fadeIn();
        },
        rank2: (callback) => {
            $('#svgL').show();
            $('#svgR').show();
            dataVisual(global.data.userRank.rank[2], '#svgL', 40);
            dataVisual(global.data.userRank.rank[3], '#svgR', 60, () => {
                $('#dataVisual').fadeOut(() => {
                    global.playPart.clean();
                    callback();
                });
            });
            $('#dataVisual').fadeIn();
        },
        rank3: (callback) => {
            dataVisualConfig.dateLabel_x = 1650;
            $('#svgM').show();
            dataVisual(global.data.userRank.rank[4], '#svgM', 80, () => {
                $('#dataVisual').fadeOut(() => {
                    global.playPart.clean();
                    callback();
                });
            });
            $('#dataVisual').fadeIn();
        },
        register: (callback) => {
            dataVisualConfig.text_x = 930;
            dataVisualConfig.typeLabel = '2020 年新用户 |';
            $("#musicdiv").animate({ width: '382px' });
            $('#svgM').show();
            dataVisual(global.data.userRank.register, '#svgM', 0, () => {
                $('#dataVisual').fadeOut(() => {
                    global.playPart.clean();
                    callback();
                });
            });
            $('#dataVisual').fadeIn();
        },
        very1: (callback) => {
            dataVisualConfig.text_x = 430;
            dataVisualConfig.dateLabel_x = 2000;
            dataVisualConfig.typeLabel = '经验变化榜';
            $('#svgL').show();
            $('#svgR').show();
            dataVisual(global.data.userRank.very[0], '#svgL', 0);
            dataVisual(global.data.userRank.very[1], '#svgR', 20, () => {
                $('#dataVisual').fadeOut(() => {
                    global.playPart.clean();
                    callback();
                });
            });
            $('#dataVisual').fadeIn();
        },
        very2: (callback) => {
            $('#svgL').show();
            $('#svgR').show();
            dataVisual(global.data.userRank.very[2], '#svgL', 40);
            dataVisual(global.data.userRank.very[3], '#svgR', 60, () => {
                $('#dataVisual').fadeOut(() => {
                    global.playPart.clean();
                    callback();
                });
            });
            $('#dataVisual').fadeIn();
        },
        clean: () => {
            $('#svgL').hide();
            $('#svgR').hide();
            $('#svgM').hide();
            $('#svgL').html('');
            $('#svgR').html('');
            $('#svgM').html('');
        }
    },
    ending: () => {
        function updateTime() {
            let ts = (new Date()).valueOf();
            $('#continuetime').text(ts - global.data.startTime);
            setTimeout(() => {
                updateTime();
            }, 5);
        }
        updateTime();
        $('#bgmname').text(global.data.audioName);
        $('#ending').fadeIn(() => {
            setTimeout(() => {
                $('#ending').fadeOut()
            }, 10000);
        });
    }
};

$(document).ready(() => {
    $('#start').fadeIn()
    let date = new Date();
    $('#today').text(
        date.getFullYear() + "-" + ((date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)) +
        "-" + (date.getDate() <= 9 ? '0' : '') + date.getDate()
    )
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

$('#dataFile').change(function () {
    if (this.files.length !== 10) return;
    $(this).attr('disabled', true);

    let readFile = (file, callback) => {
        var reader = new FileReader();
        reader.readAsText(file, dataVisualConfig.encoding);
        reader.onload = function () {
            callback(d3.csvParse(this.result));
        }
    }

    readFile(this.files[0], (data) => (global.data.userRank.rank[0] = data, global.check()));
    readFile(this.files[1], (data) => (global.data.userRank.rank[1] = data, global.check()));
    readFile(this.files[2], (data) => (global.data.userRank.rank[2] = data, global.check()));
    readFile(this.files[3], (data) => (global.data.userRank.rank[3] = data, global.check()));
    readFile(this.files[4], (data) => (global.data.userRank.rank[4] = data, global.check()));
    readFile(this.files[5], (data) => (global.data.userRank.register = data, global.check()));
    readFile(this.files[6], (data) => (global.data.userRank.very[0] = data, global.check()));
    readFile(this.files[7], (data) => (global.data.userRank.very[1] = data, global.check()));
    readFile(this.files[8], (data) => (global.data.userRank.very[2] = data, global.check()));
    readFile(this.files[9], (data) => (global.data.userRank.very[3] = data, global.check()));
})

$('#musicFile').change(function () {
    if (this.files.length !== 1) return;
    $(this).attr('disabled', true);
    global.data.audioName = this.files[0].name.replace('.mp3', '');
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.files[0]);
    fileReader.onload = (e) => (global.data.audio = e.target.result, global.check());
})