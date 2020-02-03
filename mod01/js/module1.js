doLMSSetValue('cmi.core.lesson_location', 'S200001');//-------------平台接口调用
doLMSSetValue("cmi.core.lesson_status", "start");//-------------平台接口调用

function finish() {
	$('.finishPage').css('display', 'block');
	window.parent.finishStatus[0] = true;
	window.parent.getFinishStatus();
	doLMSSetValue("cmi.core.lesson_status", "completed");
}
