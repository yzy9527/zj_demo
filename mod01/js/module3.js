try {
	doLMSSetValue('cmi.core.lesson_location', 'S200003'); //-------------平台接口调用
	doLMSSetValue("cmi.core.lesson_status", "start"); //-------------平台接口调用
} catch (e) {
	console.log(e);
}
function finish() {
	$('.finishPage').css('display', 'block');
	window.parent.finishStatus[2] = true;
	window.parent.getFinishStatus();
	doLMSSetValue("cmi.core.lesson_status", "completed");
}
