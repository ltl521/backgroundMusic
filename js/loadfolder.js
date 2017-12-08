var ajaxUp2;
    $('#folder').on('change',function () {
    var filelist = $("#folder")[0].files;  //文件对象
        for(var o in filelist ){
            var file=filelist[o];
            var type=file.type.slice(0,file.type.indexOf("/"));//文件格式
            if(type=="audio"){
                if(file.size<524288000){
                    $('.import-schedule-box').show();
                    var name = file.name.slice(0,file.name.indexOf("."));//文件名
                    var size = file.size;        //总大小
                    var succeed = 0;              /*成功次数*/
                    var  path='/'+$('.group-list .choosed .group-name').html()+'/'+name;  /*文件路径*/
                    var shardSize =  1024,    //以1kb为一个分片
                        shardCount = Math.ceil(size / shardSize);  //总片数
                    for(var i = 0;i < shardCount;++i){
                        //计算每一片的起始与结束位置
                        var start = i * shardSize,
                            end = Math.min(size, start + shardSize);
                        //构造一个表单，FormData是HTML5新增的
                        var form = new FormData();
                        var data=file.slice(start,end);//slice方法用于切出文件的一部分内容
                        var reader=new FileReader();
                        reader.readAsArrayBuffer(data);
                        $(reader).load(function(e){
                            var blob=e.target.result;
                            var b=hex_md5(blob);
                            form.append("md5",b);/*分片MD5*/
                            form.append("path", path);     /*路径*/
                            form.append("start", start);        //开始位置
                            form.append("size", shardSize);  //分片大小
                            form.append("data", data);  //slice方法用于切出文件的一部分内容
                            //Ajax提交
                            ajaxUp2= $.ajax({
                                url: "json/dealUpload.josn",
                                type: "POST",
                                data: form,
                                async: true,        //异步
                                processData: false,  //很重要，告诉jquery不要对form进行处理
                                contentType: false,  //很重要，指定为false才能形成正确的Content-Type
                                success: function(data){
                                    if(data.ret==0){
                                        ++succeed;
                                        var succeedPre=(Math.round(succeed / shardCount * 10000) / 100).toFixed(0);
                                        $('#progressBar').attr('value', succeedPre);
                                        $("#import-per").html(succeedPre+"%");
                                        if(succeedPre==100){
                                            $('.import-schedule-box').hide();

                                        }
                                    }else if(data.ret==-11){
                                        $.ajax({
                                            url: "json/dealUpload.josn",
                                            type: "POST",
                                            data: form,
                                            async: true,        //异步
                                            processData: false,  //告诉jquery不要对form进行处理
                                            contentType: false,  //指定为false才能形成正确的Content-Type
                                            success: function(data){
                                                if(data.ret==0){
                                                    ++succeed;
                                                    var succeedPre=(Math.round(succeed / shardCount * 10000) / 100).toFixed(0);
                                                    $('#progressBar').attr('value', succeedPre);
                                                    $("#import-per").html(succeedPre+"%");
                                                    if(succeedPre==100){
                                                        $('.import-schedule-box').hide();

                                                    }
                                                }else{
                                                    alert('上传错误');
                                                    $('.import-schedule-box').hide();
                                                    return
                                                }
                                            }

                                        });
                                    }
                                }

                            });
                        })
                    }
                }else{
                    $(".file-kb-prompt-box").show();
                }
            }else{
                break
            }
        }

});
//取消上传
$(".import-cal").on("click",function(){
    ajaxUp2.abort();
    $(".import-schedule-box").hide();
});