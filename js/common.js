/**
 * Created by wangxiang on 2017/10/18.
 */
var clang={
    /*login*/
    /*q用户名*/
    '请输入用户名':'Enter Username',
    '请输入密码':'Please input  password',
    '登陆':'Login',
    '用户名:':'Username:',
    '密码:':'Password:',
    '用户名错误!':'Username Error!',
    '密码错误!':'Password Error!',
    /*user config*/
    '当前用户名:':'Current Username:',
    '修改密码:':'New Password:',
    '当前密码:':'Current Password:',
    '再次输入:':'Re-enter:',
    '确认修改':'OK',
    '用户密码修改':'Username And Password Modify',
    '请输入6-16位字母与数字':'Please enter 6-16 digit letters and numbers',
    '取消':'Back',
    '密码错误':'Password Error',
    '当前密码错误':'Current Password Error',
    '新用户名输入错误':'New Username Error',
    '新密码输入错误':'New Password Error',
    '密码不一致':'Entered passwords differ',
    '退出账号':'Logout',
    /*操作页面*/
    '导入歌曲':'Import Songs',
    '导入文件夹':'Import Folder',
    '设备':'Device',
    '我的收藏':'My Collection',
    '名称':'Song Name',
    '大小':'Size',
    '时长':'Duration',
    '格式':'Format',
    '新建文件夹':'New Folder',
    '确定':'OK',
    '确认删除所选文件夹吗':'Confirm to delete the selected folder',
    '确认删除所选歌曲吗':'Confirm deletion of the selected song',
    '选择目标目录':'Select target directory',
    '移动':'Move',
    '下载':'Download',
    '请选择小于500M的文件上传':'Please select a file upload less than 500MB',
    '正在导入':'Importing',
    '正在下载':'Downloading',
    '背景音乐操作面板':'Background music panel',
    '请输入新文件夹的名称':'Please enter the name of the new folder',
    '原文件夹名称:':'Original folder name:',
    '修改文件夹名称:':'Modify folder name:',
    '请输入新名称':'Please enter a new name'
};
function transEnglish(zhong){
    return clang[zhong];
}
function transChinese(zhong){
    return zhong;
}
var trans=transEnglish;
function useEnglish(){
    trans = transEnglish;
    translate();
}
function useChinese(){
    trans = transChinese;
    translate();
}

$('.lang-sel .lang-en').on('click',function (e) {
    e.stopPropagation();
    $('.lang-sel').hide();
    $('.lang-pic').addClass("chinese").removeClass("english");
    $('.lang-pic').css('background','url(img/slice.png) no-repeat -29px -17px');
    useChinese()

});
$('.lang-sel .lang-cn').on('click',function (e) {
    e.stopPropagation();
    $('.lang-sel').hide();
    $('.lang-pic').addClass("english").removeClass("chinese");
    $('.lang-pic').css('background','url(img/slice.png) no-repeat -29px -39px');
    useEnglish()
});


//点击修改密码
$(".xgmm").on("click",function(){
    location.href="modifyLogin.html";
});

//退出
$(".tuichu").on("click",function(){
    //跳转到登陆界面
    window.location.href='login.html';
});

