// 显示 隐藏 滚动条
export const overFlow = function (par='hidden') {
	par=="auto"
	?document.body.style.overflow='auto'
	:document.body.style.overflow='hidden';
}

// 设置body高度
export const bodyHeight = function (height = 'auto') {
	if(height == "100"){
		document.getElementsByTagName('body')[0].style.height = '100%';
		document.getElementById('app').style.height = '100%';
	}else if(height == "auto"){
		document.getElementsByTagName('body')[0].style.height = 'auto';
		document.getElementById('app').style.height = 'auto';
	}else{
		document.getElementsByTagName('body')[0].style.height = height+'px';
		document.getElementById('app').style.height = height+'px';
	}
	
}

// 返回
export const goback = function () {
	this.$router.go(-1);
}