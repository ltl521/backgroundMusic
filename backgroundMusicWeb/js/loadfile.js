var ajaxUp;
/*20171117*/
$("#fileToUpload").on("change",function(){
    var file = $("#fileToUpload")[0].files[0];  //文件对象
    var type=file.type.slice(0,file.type.indexOf("/"));//文件格式
    if(type=="audio"){
        if(file.size<524288000){
            var name = file.name.slice(0,file.name.indexOf("."));//文件名
            var size = file.size;        //总大小
            var succeed = 0;              /*成功次数*/
            var  path='/'+$('.group-list .choosed .group-name').html()+'/'+name;  /*文件路径*/
            var shardSize =  4*1024,    //以1kb为一个分片
                shardCount = Math.ceil(size / shardSize);  //总片数
            var fileReader=new FileReader();
            blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
            var spark = new SparkMD5();
            fileReader.readAsBinaryString(blobSlice.call(file,0, size));
            fileReader.onload = function(e) {
                spark.appendBinary(e.target.result);
                $("#box").html( spark.end());
                $.ajax({
                    type:"post",
                    url:"json/dealUpload.json",
                    data:{
                        "md5": $("#box").html(),
                        "size":size,
                        "path": path
                    },
                    success:function(data){
                        if(data.ret==0){
                            $('.import-schedule-box').show();
                            for(var i = 0;i < shardCount;++i){
                                //计算每一片的起始与结束位置
                                var start = i * shardSize,
                                    end = Math.min(size, start + shardSize);
                                //构造一个表单，FormData是HTML5新增的
                                var form = new FormData();
                                var data=file.slice(start,end);//slice方法用于切出文件的一部分内容
                                form.append("start", start);        //开始位置
                                form.append("shardSize", shardSize);  //分片大小
                                form.append("data",data);
                                //Ajax提交
                                ajaxUp= $.ajax({
                                    url: "json/dealUpload.josn",
                                    type: "POST",
                                    data: form,
                                    async: true,        //异步
                                    processData: false,  //告诉jquery不要对form进行处理
                                    contentType: false,  //指定为false才能形成正确的Content-Type
                                    success: function(data){
                                        if(ajaxUp){
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
                                                    url: "json/left.josn",
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
                                                        }else{
                                                            alert('上传错误');
                                                            $('.import-schedule-box').hide();
                                                            return
                                                        }
                                                    }
                                                });
                                            }
                                        }

                                    },
                                    error:function(error){
                                        console.log(error)
                                    }
                                });
                            }
                        }
                    }

                })
            };


        }else{
            $(".file-kb-prompt-box").show();
        }
    }else{
        alert("请选择音频文件");
        return
    }
})

//取消上传
$(".import-cal").on("click",function(){
    if(ajaxUp){
        ajaxUp.abort();
    }
    $(".import-schedule-box").hide();
});