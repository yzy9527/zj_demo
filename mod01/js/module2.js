doLMSSetValue('cmi.core.lesson_location', 'S200002');//-------------平台接口调用
doLMSSetValue("cmi.core.lesson_status", "start");//-------------平台接口调用

function finish() {
	$('.finishPage').css('display', 'block');
	window.parent.finishStatus[1] = true;
	window.parent.getFinishStatus();
	doLMSSetValue("cmi.core.lesson_status", "completed");
}
