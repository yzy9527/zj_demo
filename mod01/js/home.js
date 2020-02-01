//模块完成情况
var finishStatus = [false,false,true];
var OnlineStatus = false;
var moduleList = [
    './module1.html',
    './module2.html',
    './module3.html',
    './module4.html'
]

window.onload = function(){
    getFinishStatus();
    changeIframe(0)
}
$('.cs-btn-home').click(function (e) {
    changeIframe($(this).attr('num'))
})

function changeIframe(id){
    $('.ifm').attr('src',moduleList[id]);
    var homeBtn = $('.cs-btn-home');
    homeBtn.each(function (idx,ele) {
        if(idx == id){
            $('.cs-btn-h'+id).addClass('cs-btn-choose')
        }else{
            $(ele).removeClass('cs-btn-choose')
        }
        
    })
    
}

if (OnlineStatus) {
    var studyResult = JSON.parse(doLMSGetValue('cmi.launch_data'));
    console.log('studyResult', studyResult)
    if (studyResult.S200001 == 1) {
        finishStatus[0] = true;
    }
    if (studyResult.S200002 == 1) {
        finishStatus[1] = true;
    }
    if (studyResult.S200003 == 1) {
        finishStatus[2] = true;
    }
}
function getFinishStatus(params) {
    finishStatus.forEach(function(element,index) {
        if (element) {
            $('.Icon'+index).css('display','block');
        }
        
    })
}