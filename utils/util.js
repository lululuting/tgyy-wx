// 格式时间戳
const formatTime = date => {
   const year = date.getFullYear()
   const month = date.getMonth() + 1
   const day = date.getDate()
   const hour = date.getHours()
   const minute = date.getMinutes()
   const second = date.getSeconds()

   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

// 格式字符串
const formatNumber = n => {
   n = n.toString()
   return n[1] ? n : '0' + n
};

// 随机颜色
const getRandomColor =function() {
    let rgb = []
    for (let i = 0 ; i < 3; ++i){
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length == 1 ? '0' + color : color
        rgb.push(color)
    }
    return '#' + rgb.join('')
};

//格式播放时间
const formatMusicDuration = function (second) {
    return [parseInt(parseInt(second) / 60 ), parseInt(second)% 60].join(":").replace(/\b(\d)\b/g,"0$1");
};


//格式化歌词
const createLrc = function(relrc,musicLrc) {
    let lrcList =  relrc.split("\n");//去空格

    for(let i =0;i<lrcList.length;i++){
        let t = lrcList[i].substring(lrcList[i].indexOf("[") + 1, lrcList[i].indexOf("]"));

        musicLrc.push({
            time: (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3),
            text: lrcList[i].substring(lrcList[i].indexOf("]") + 1, lrcList[i].length)
        });
    }

    return musicLrc;
};




module.exports = {
   formatTime: formatTime,
   formatNumber:formatNumber,
   getRandomColor:getRandomColor,
   createLrc:createLrc,
   formatMusicDuration:formatMusicDuration,
};
