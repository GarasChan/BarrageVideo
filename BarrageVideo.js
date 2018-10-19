let myVideo = document.getElementById("myVideo");
    videoContainer = document.getElementsByClassName("video-container")[0],
    videoControl = document.getElementsByClassName("video-control")[0],
    playToolDIV = document.getElementsByClassName("play-tool")[0],
    timeCurrentDIV = document.getElementsByClassName("time-current")[0],
    timeTotalDIV = document.getElementsByClassName("time-total")[0],
    barrageToolDIV = document.getElementsByClassName("barrage-tool")[0],
    volumeToolDIV = document.getElementsByClassName("volume-tool")[0],
    settingToolDIV = document.getElementsByClassName("setting-tool")[0],
    fullscreenToolDIV = document.getElementsByClassName("fullscreen-tool")[0];
    processContainerDIV = document.getElementsByClassName("process-container")[0],
    processBarDIV = document.getElementsByClassName("process-bar")[0],
    cacheBar = document.getElementsByClassName("cache-bar")[0],
    playBar = document.getElementsByClassName("play-bar")[0],
    adjustToolDIV = document.getElementsByClassName("adjust-tool")[0],
    processInfoDIV = document.getElementsByClassName("process-info")[0],
    volumeContainerDIV = document.getElementsByClassName("volume-container")[0],
    volumeValueDIV = document.getElementsByClassName("volume-value")[0],
    volumeSliderBgDIV = document.getElementsByClassName("volume-slider-bg")[0],
    volumeBgDIV = document.getElementsByClassName("volume-bg")[0],
    volumeSliderDIV = document.getElementsByClassName("volume-slider")[0];
    volumeContentDIV = document.getElementsByClassName("volume-content")[0];
    
    

let timeTotal = 0, 
    timeCurrent = 0, 
    timeCache = 0, 
    isFullScreen = false,
    isProcessMove = false,
    volume = 50,
    muted = false,
    videoControlTimer = null;

myVideo.addEventListener("loadeddata", initVideo);
myVideo.addEventListener("timeupdate", setCurrentTime);
playToolDIV.addEventListener("click", changePlayStatus);
fullscreenToolDIV.addEventListener("click", changeScreenStatus);
processContainerDIV.addEventListener("mousedown", processMousedown);
processContainerDIV.addEventListener("mousemove", showProcessInfo);
volumeSliderBgDIV.addEventListener("mousedown", changeVideoVolume);
volumeToolDIV.addEventListener("mousedown", changeVolumeMute);
videoContainer.addEventListener("mouseenter", mouseOverVideo);
videoControl.addEventListener("mouseenter", showVideoControl);



/**
 * 显示底部工具栏
 */
function mouseOverVideo() {
    videoControl.style.display = "block";
    videoContainer.addEventListener("mousemove", hideVideoControl);
}

/**
 * 隐藏底部工具栏
 */
function hideVideoControl(e) {
    videoControl.style.display = "block";
    clearInterval(videoControlTimer);
    if (e.target === myVideo) {
        videoControlTimer = setTimeout(function () {
            let a = e.target;
            videoControl.style.display = "none";
        }, 5000);
    }
}

function mouseLeaveVideo() {
    setTimeout(() => {
        videoControl.style.display = "none";
    }, 5000);
}

function showVideoControl() {
    videoControl.style.display = "block";
    clearInterval(videoControlTimer);
}


/**
 * 切换静音和非静音状态
 */
function changeVolumeMute() {
    muted = !muted;
    myVideo.muted = muted;
    if (muted) {
        updateVolume(0, muted);
    }
    else {
        if (volume === 0) {
            volume = 50;
        }
        updateVolume(volume, muted);
    }
}

/**
 * 更新音量大小和状态
 * @param {Number} volume 音量大小
 * @param {Boolean} muted 是否静音
 */
function updateVolume(volume, muted) {
    let delta = volumeSliderDIV.offsetHeight / 2;
    if (volume === 0 || muted) {
        removeClass(volumeToolDIV, "h5-video-volume-on");
        addClass(volumeToolDIV, "h5-video-volume-off");
        volumeSliderDIV.style.top = 100 - delta + "%";
        volumeBgDIV.style.height = 0 + "%";
        volumeValueDIV.innerText = 0 + "%";
    }
    else {
        removeClass(volumeToolDIV, "h5-video-volume-off");
        addClass(volumeToolDIV, "h5-video-volume-on");
        volumeSliderDIV.style.top = 100 - volume - delta + "%";
        volumeBgDIV.style.height = volume + "%";
        volumeValueDIV.innerText = volume + "%";
    }
}

/**
 * 改变音量大小
 * @param {Event} e 
 */
function changeVideoVolume(e) {
    e = e || window.event;
    if (e.button !== 0) {
        return;
    }
    let volumeSliderBgHeight = volumeSliderBgDIV.offsetHeight,
        delta = volumeSliderDIV.offsetHeight / 2;
    if (e.target === volumeSliderBgDIV || e.target === volumeBgDIV) {
        let top = e.target === volumeSliderBgDIV ? e.offsetY : e.offsetY + e.target.offsetTop; 
        top = top < 0 ? 0 : top;
        top = top > volumeSliderBgHeight ? volumeSliderBgHeight : top;

        volume = 100 - top;
        myVideo.volume = volume / volumeSliderBgHeight;
        if (muted && volume > 0) {
            muted = !muted;
            myVideo.muted = muted;
        }
        if (volume === 0) {
            muted = true;
            myVideo.muted = muted;
        }
        updateVolume(volume, muted);
    } else if(e.target === volumeSliderDIV) {
        let top = e.clientY - volumeSliderDIV.offsetTop;
        document.onmousemove = VolumeBarDragging.bind(e, top);
        document.onmouseup = VolumeBarUp;
    }
}

/**
 * 音量拖动事件
 * @param {*} e 
 */
function VolumeBarDragging(top, e) {
    e = e || window.event;
    if (e.button !== 0) {
        return;
    }
    let yTop = e.clientY - top;
    if (yTop <= 0) {
        yTop = 0;
    };
    if (yTop >= volumeSliderBgDIV.clientHeight) {
        yTop = volumeSliderBgDIV.clientHeight;
    };
    volume = 100 - yTop;
    myVideo.volume = volume / volumeSliderBgDIV.clientHeight;
    if (muted && volume > 0) {
        muted = !muted;
        myVideo.muted = muted;
    }
    if (volume === 0) {
        muted = true;
        myVideo.muted = muted;
    }
    updateVolume(volume, muted);
}

/**
 * 停止音量拖动
 */
function VolumeBarUp(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    // document.removeEventListener("mousemove", VolumeBarDragging);
    // document.removeEventListener("mouseup", VolumeBarUp);
}

/**
 * 进度条鼠标按下事件
 * @param {Event} e 
 */
function processMousedown(e) {
    if (e.button !== 0) {
        return;
    }
    let left = getProcessLeft(e);
    let percentLeft = left / processContainerDIV.offsetWidth;
    myVideo.currentTime = percentLeft * timeTotal;
    adjustToolDIV.style.left = percentLeft * 100 + "%";

    document.onmousemove = processMousemove;
    document.onmouseup = processMouseup;
    // document.addEventListener("mousemove", processMousemove);
    // document.addEventListener("mouseup", processMouseup);
}

/**
 * 进度条拖动事件
 * @param {Event} e 
 */
function processMousemove(e) {
    e = e || window.event;
    let processBarWidth = processBarDIV.offsetWidth;
    let left = e.clientX - videoContainer.offsetLeft;
    if (left <= 0) {
        left = 0;
    };
    if (left >= processBarWidth) {
        left = processBarWidth;
    };
    
    let percentLeft = left / processBarWidth;
    adjustToolDIV.style.left = percentLeft * 100 + "%";
    myVideo.currentTime = percentLeft * timeTotal;
    
}

/**
 * 鼠标移出进度条
 * @param {Event} e 
 */
function processMouseup() {
    document.onmousemove = null;
    document.onmouseup = null;
    // document.removeEventListener("mousemove", processMousemove);
    // document.removeEventListener("mouseup", processMouseup);
}

/**
 * 鼠标移入进度条显示当前时间
 * @param {Event} e 
 */
function showProcessInfo(e) {
    e = e || window.event;
    let processBarWidth = processContainerDIV.offsetWidth,
        infoWidth = processInfoDIV.clientWidth,
        left = getProcessLeft(e),
        infoLeft = (left - infoWidth / 2) / processBarWidth,
        info = formatTime(left / processBarWidth * timeTotal);
    if (left < infoWidth / 2) {
        infoLeft = 0;
    }
    if (left > processBarWidth - infoWidth / 2) {
        infoLeft = (processBarWidth - infoWidth) / processBarWidth;
    }
    processInfoDIV.style.left = infoLeft * 100 + "%";
    processInfoDIV.innerText = info;
}

/**
 * 获取进度条点击位置长度
 * @param {Object} e 事件源对象
 */
function getProcessLeft(e) {
    e = e || window.event;
    let left = e.offsetX, processContainerWidth = processContainerDIV.offsetWidth;
    if (e.target.className === "adjust-tool") {
        let innerLeft = e.target.style.left || 0;
        left = parseFloat(innerLeft) / 100 * processContainerWidth + e.offsetX;
    };
    left = left < 0 ? 0 : left;
    left = left > processContainerWidth ? processContainerWidth : left;
    
    return left;
}

/**
 * 设置视频缓存进度条长度
 */
function setCacheTime() {
    if (myVideo.buffered.length > 0) {
        timeCache = myVideo.buffered.end(0);
    }
    cacheBar.style.width = 100 * (timeCache / timeTotal) + "%";
    // 在视频播放期间每500毫秒进行一次递归，重新获取缓存值;
    if (timeCache < timeTotal) {
        setInterval(setCacheTime, 500);
    }
}
setCacheTime();

/**
 * 获取视频播放进度条长度
 */
function updateCurrentProcess() {
    let width = 100 * (timeCurrent / timeTotal);
    playBar.style.width = width + "%";
    adjustToolDIV.style.left = width + "%";
}

/**
 * 全屏
 *
 * @param {Element} element  需要全屏的元素
 */
function fullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * 退出全屏
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * 全屏或非全屏
 * @param {Element} element  需要全屏的元素
 */
function changeScreenStatus() {
    if (isFullScreen) {
        exitFullscreen();
        removeClass(fullscreenToolDIV, "h5-video-mini-screen");
        addClass(fullscreenToolDIV, "h5-video-fullscreen");
        isFullScreen = false;
    } else {
        fullScreen(videoContainer);
        removeClass(fullscreenToolDIV, "h5-video-fullscreen");
        addClass(fullscreenToolDIV, "h5-video-mini-screen");
        isFullScreen = true;
    }
}

/**
 * 将ms转换成min:seconds格式
 */
function formatTime(ms) {
    let mins = Math.floor(ms / 3600.0) * 60.0 + Math.floor(ms % 3600.0 / 60.0),
        seconds = Math.floor(ms % 60.0);
    
    mins = mins < 10 ? "0" + mins : mins;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return mins + ":" + seconds;
}

/**
 * 获取播放视频当前时长
 */
function setCurrentTime() {
    timeCurrent = myVideo.currentTime;
    timeCurrentDIV.innerText = formatTime(myVideo.currentTime);
    //更新进度条
    updateCurrentProcess();
}

/**
 * 设置视频总时长
 */
function initVideo() {
    //初始化音量大小
    myVideo.volume = volume / 100;
    volumeValueDIV.innerText = volume + "%";
    volumeBgDIV.style.height = volume + "%";
    volumeSliderDIV.style.top = 100 - volume - volumeSliderDIV.offsetHeight / 2 + "%";
    //初始化视频总时长
    timeTotal = myVideo.duration;
    timeTotalDIV.innerText = formatTime(timeTotal);
}

/**
 * 播放或暂停
 */
function changePlayStatus() {
    if (myVideo.paused || myVideo.ended) {
        myVideo.play();
        removeClass(playToolDIV, "h5-video-play");
        addClass(playToolDIV, "h5-video-pause");
    } else {
        myVideo.pause();
        removeClass(playToolDIV, "h5-video-pause");
        addClass(playToolDIV, "h5-video-play");
    }
}

/**
 * 添加样式
 * @param {Element} element element
 * @param {String} 样式名
 */
function addClass(element, className) {
    if (!element) {
        return;
    }
    let elmClass = element.getAttribute("class");
    if (className && elmClass.indexOf(className) < 0) {
        elmClass += ` ${className}`;
    }
    element.setAttribute("class", elmClass.trim());
}

/**
 * 移除样式
 * @param {Element} element element
 * @param {String} 样式名
 */
function removeClass(element, className) {
    if (!element) {
        return;
    }
    let elmClass = element.getAttribute("class").trim();
    if (className && elmClass.indexOf(className) > -1) {
        elmClass = elmClass.replace(className, "");
    }
    element.setAttribute("class", elmClass.trim());
}
