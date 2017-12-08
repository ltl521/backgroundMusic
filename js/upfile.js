/**
 * Created by Administrator on 2017/10/25.
 */
/*新建文件夹要回第一个*/

//加载文件夹列表
function getData(beginNum){
  $.ajax({
    type:"post",
    url:"json/left.json",
    data:{"size":20,"begin":beginNum},
    dataType:"json",
    success:function(data){
      if(data.ret==0){
        if(data.folderList.length>0){
          var folderList=data.folderList;
          var html='';
          for(var i= 0,len=folderList.length;i<len;i++){
            html+='<div class="folder-item"><span class="group-pic"></span><span class="group-name">';
            html+=folderList[i].title;
            html+='</span></div>';
          }
          $(".group-list").html(html);
          $(".group-list .folder-item:first-child").addClass("choosed");
          getFileData(0,folderList[0].title)
        }
      }
    }
  });

}
//右侧文件列表
function getFileData(beginNum,folder){
  $(".song-table tbody").html('');
  var html='';
  $.ajax({
    type:"post",
    url:"json/dealIncFiles.json",
    data:{"size":20,"begin":beginNum,"Folder":folder},
    dataType:"json",
    success:function(data){
      if(data.ret==0){
        if(data.fileList.length>0){
          var fileList=data.fileList;
          for(var i= 0,len=fileList.length;i<len;i++){
            html+='<tr><td><span class="choose-box"></span></td><td class="song-name">';
            html+=fileList[i].title;
            html+='</td><td class="song-kb">';
            var size=fileList[i].fileSize;
            if((size/1024)>1){
              size=parseFloat(size/1024).toFixed(2);
              html+=size;
              html+="MB";
            }else{
              html+=size;
              html+="KB";
            }
            html+='</td><td class="song-form">';
            html+=fileList[i].fileType;
            html+='</td></tr>';
          }
          $(".song-table tbody").html(html);
        }
      }
    }
  })
}
getData(0);//第一次加载文件夹列表




/*左侧滚动*/
var LeftScorl=20;
var Leftend=0;
function scrollGetData(beginNum){
  if(Leftend==0){
    $.ajax({
      type:"post",
      url:"json/left.json",
      data:{"size":20,"begin":beginNum},
      dataType:"json",
      success:function(data){
        if(data.ret==0){
          if(data.folderList.length>0){
            var folderList=data.folderList;
            var html='';
            for(var i= 0,len=folderList.length;i<len;i++){
              html+='<div class="folder-item"><span class="group-pic"></span><span class="group-name">';
              html+=folderList[i].title;
              html+='</span></div>';
            }
            Leftend=len-20;
            $(".group-list").append(html);
          }
        }
      }
    })

    LeftScorl+=20;
  }

}
$(".group-list").scroll(function(){
  var divHeight = $(this).height();//容器高度
  var nScrollHeight = $(this)[0].scrollHeight-32;//滚动条需要滚动的高度
  var nScrollTop = $(this)[0].scrollTop;//滚动条滚动的高度
  if(nScrollTop + divHeight >= nScrollHeight) {//滚动到底部
    scrollGetData(LeftScorl);
  }
});

/*右侧滚动*/
var RightScorl=20;
var end=0;
function scroolRightData(beginNum,folder){
  if(end==0){
    $.ajax({
      type:"post",
      url:"json/dealIncFiles.json",
      data:{"size":20,"begin":beginNum,"Folder":folder},
      dataType:"json",
      success:function(data){
        if(data.ret==0){
          if(data.fileList.length>0){

            var fileList=data.fileList;
            var html='';
            for(var i= 0,len=fileList.length;i<len;i++){
              html+='<tr><td><span class="choose-box"></span></td><td class="song-name">';
              html+=fileList[i].title;
              html+='</td><td class="song-kb">';
              var size=fileList[i].fileSize;
              if((size/1024)>1){
                size=parseFloat(size/1024).toFixed(2);
                html+=size;
                html+="MB";
              }else{
                html+=size;
                html+="KB";
              }
              html+='</td><td class="song-form">';
              html+=fileList[i].fileType;
              html+='</td></tr>';
            }
            end=len-20;

            $(".song-table tbody").append(html);

          }
        }
      }
    })
    RightScorl+=20;
  }




}
//判断文件列表滚动事件
$(".song-table-box").scroll(function(){
  var divHeight = $(this).height();//容器高度
  var nScrollHeight = $(this)[0].scrollHeight-24;//滚动条需要滚动的高度
  var nScrollTop = $(this)[0].scrollTop;//滚动条滚动的高度
  var ctr_folder=$(".choosed").find(".group-name").text();
  if(nScrollTop + divHeight >= nScrollHeight) {//滚动到底部
    scroolRightData(RightScorl,ctr_folder);
  }
});


//文件夹列表选择
$(".group-list").on("click",".folder-item",function(){
  $(this).addClass("choosed");
  end=0;
  RightScorl=20;
  $(".song-table-box")[0].scrollTop=0;
  $(this).siblings("div").removeClass("choosed");
  var crt_folder=$(this).find(".group-name").text();
  getFileData(0,crt_folder);

});

/*新建文件夹*/

$(".sb-btns-creat").on("click",function(){
  $('.creat-file-box').show();
});
$('#newFileName').on('focus',function () {
  $(this).val('')
});
//取消新建
$('.creat-file-box .cancel').on('click',function () {
  $('.creat-file-box').hide();
  $("#newFileName").val('新建文件夹');
});
//确定新建
$('.creat-file-box .sure').on('click',function () {
  var folderName=$('#newFileName').val();
  $.ajax({
    type:"post",
    url:"json/dealNewFolder.json",
    data:{"folderName":folderName},
    dataType:"json",
    success:function(data){
      if(data.ret==0){//新建成功
        $('.creat-file-box').hide();
        /*重新加载文件列表*/
        getData(0);
      }
      else if(data.ret==-5){// 新建失败
        if($(".lang-pic").hasClass("chinese")){
          alert("文件夹已存在，请重新输入")
        }else{
          alert("A folder already exists, please input again");
        }
      }
    },
    error:function(){}
  })
});



//修改文件夹名称
$(".sb-btns-edit").on("click",function(){
  if($('.group-list .choosed')[0]){
    $('.edit-file-box').show();
    var val=$('.group-list .choosed .group-name').html();
    $('#F-fileName').html(val)
  }else{
    alert('请选择要修改的文件夹')
  }
});
$('#newName').on('focus',function () {
  $(this).val('')
});
//取消修改
$('.edit-file-box .cancel').on('click',function () {
  $('.edit-file-box').hide();
  $("#newName").val('请输入新名称');
});
//确定修改
$('.edit-file-box .sure').on('click',function () {
  var val1=$('#F-fileName').text();
  var val2=$('#newName').val();
  if(val2){
    $.ajax({
      type:"post",
      url:"json/dealRenameFolder.json",
      data:{"folderName":val1,"newrName":val2},
      dataType:"json",
      success:function(data){
        if(data.ret==0){//修改成功
          $('.edit-file-box').hide();
          $('.group-list .choosed .group-name').html(val2);

        }else if(data.ret==-7){//修改失败
          if($(".lang-pic").hasClass("chinese")){
            alert("文件夹已存在，请重新输入")
          }else{
            alert("A folder already exists, please input again");
          }
        }
      },
      error:function(){}
    });
  }else{
    if($(".lang-pic").hasClass("chinese")){
      alert("请输入修改后的文件夹名称")
    }else{
      alert("Please enter the name of the modified folder");
    }
  }

});



//删除文件夹
var delFloder;
$(".sb-btns-del").on("click",function(){
  if(!$(".choosed")[0]){
    alert("请选择要删除的文件夹")
  }else{
    delFloder=$(".choosed .group-name").text();
    $(".del-file-box").show();
  }
});
//取消删除
$(".del-file-cancel").on("click",function(){
  $(".del-file-box").hide();
});
//确定删除
$(".del-file-ok").on("click",function(){
  $.ajax({
    type:"post",
    url:"json/dealDelFolder.json",
    data:{"folderName":delFloder},
    dataType:"json",
    success:function(data){
      if(data.ret==0){
        $(".del-file-box").hide();
        getData(0)
      }else if(data.ret==-6){//文件夹删除出错
        alert("文件夹删除出错")
      }
    },
    error:function(){}
  })
});





//歌曲全选按钮
$(".song-table-head .choose-box").on("click",function(){
  if(!$(this).hasClass("box-choosed")){
    $(this).addClass("box-choosed");
    $(".song-table .choose-box").each(function(){
      $(this).addClass("box-choosed");
      $(this).parent().parent("tr").addClass("active");
    })
  }else{
    $(this).removeClass("box-choosed");
    $(".song-table .choose-box").each(function(){
      $(this).removeClass("box-choosed");
      $(this).parent().parent("tr").removeClass("active");
    })
  }
});

//歌曲列表选择
$(".song-table").on("click",".choose-box",function(){
  if(!$(this).hasClass("box-choosed")){
    $(this).addClass("box-choosed");
    $(this).parent().parent("tr").addClass("active");
  }else{
    $(".song-table-head .choose-box").removeClass("box-choosed");
    $(this).removeClass("box-choosed");
    $(this).parent().parent("tr").removeClass("active");
  }
});




//歌曲移动
//获取文件夹列表
function moveGetFolder(beginNum){
  $.ajax({
    type:"post",
    url:"json/left.json",
    data:{"size":20,"begin":beginNum},
    dataType:"json",
    success:function(data){
      if(data.ret==0){
        if(data.folderList.length>0){
          var folderList=data.folderList;
          var html='';
          for(var i= 0,len=folderList.length;i<len;i++){
            html+='<div><span></span><span class="target-file-name">';
            html+=folderList[i].title;
            html+='</span></div>';
          }
          $(".target-file").html(html);
          $(".target-file div:first-child").addClass("clicked");
        }
      }
    }
  })
}

//移动文件夹滚动函数
var moveScrollNum=20;
var moveEnd=0;
function moveScrollFolder(beginNum){
  if(moveEnd==0){
    $.ajax({
      type:"post",
      url:"json/left.json",
      data:{"size":20,"begin":beginNum},
      dataType:"json",
      success:function(data){
        if(data.ret==0){
          if(data.folderList.length>0){
            var folderList=data.folderList;
            var html='';
            for(var i= 0,len=folderList.length;i<len;i++){
              html+='<div><span></span><span class="target-file-name">';
              html+=folderList[i].title;
              html+='</span></div>';
            }
            moveEnd=len-20;
            $(".target-file").append(html);
          }
        }
      }
    })
    moveScrollNum+=20;
  }

}


//判断移动文件时文件夹列表滚动
$(".target-file").scroll(function(){
  var divHeight = $(this).height();//容器高度
  var nScrollHeight = $(this)[0].scrollHeight-10;//滚动条需要滚动的高度
  var nScrollTop = $(this)[0].scrollTop;//滚动条滚动的高度
  if(nScrollTop + divHeight >= nScrollHeight) {//滚动到底部
    moveScrollFolder(moveScrollNum);
  }
});


$(".target-file").on("click","div",function(){
  $(this).addClass("clicked");
  $(this).siblings().removeClass("clicked");
});
//点击移动按钮
$(".song-btns-move").on("click",function(){
  if(!$(".song-table .active")[0]){
    if($(".lang-pic").hasClass("chinese")){
      alert("请选择要移动的歌曲")
    }else{
      alert("Please select the songs to move");
    }
  }else{
    $(".s-m-prompt-box").show();
    moveGetFolder(0);
  }
});
//取消移动
$(".move-cancel").on("click",function(){
  $(".s-m-prompt-box").hide();
});
//确定移动
$(".move-ok").on("click",function(){
  var fileFloder=$(".choosed").find(".group-name").html();//原文件夹
  var targetFileFolder=$(".clicked .target-file-name").html();//新文件夹
  $(".song-table .active").each(function(){
    var _this=this;
    var movefile=$(this).find(".song-name").html();//要移动的歌曲名
    filePath="/"+fileFloder+"/"+movefile;//原路径
    newPath="/"+targetFileFolder+"/"+movefile;//新路径
    $.ajax({
      type:"post",
      url:"json/dealMvFile.json",
      data:{"filePath":filePath,"newPath":newPath},
      dataType:"json",
      success:function(data){
        if(data.ret==0){
          $(".s-m-prompt-box").hide();
          $(_this).remove();
        }else if(data.ret==-8){//歌曲移动出错
          alert("移动出错")
        }
      }
    })
  });

});



//歌曲删除
$(".song-btns-del").on("click",function(){
  if(!$(".song-table .active")[0]){
    if($(".lang-pic").hasClass("chinese")){
      alert("请选择要删除的歌曲")
    }else{
      alert("Please select the songs you want to delete");
    }
  }else{
    $('.del-song-box').show();
  }
});
//取消删除
$(".del-song-cancel").on('click',function(){
  $('.del-song-box').hide();
});
//确定删除
$(".del-song-ok").on("click",function(){
  var delfileFolder=$(".choosed").find(".group-name").html();//原文件夹
  var delfilePath;
  $(".active").each(function(){
    var _this=this;
    var delfile=$(this).find(".song-name").html();//要删除的歌曲名称
    delfilePath="/"+delfileFolder+"/"+delfile;//删除的歌曲路径
    $.ajax({
      type:"post",
      url:"json/dealDelFile.json",
      data:{"filePath":delfilePath},
      dataType:"json",
      success:function(data){
        if(data.ret==0){
          $('.del-song-box').hide();
          $(_this).remove();
        }else if(data.ret==-9){
          alert("删除出错")
        }
      }
    })
  });
});




//文件大小提示确定按钮
$(".file-kb-ok").on("click",function(){
  $(".file-kb-prompt-box").hide();
  var file=$("#file");
  file.after(file.clone().val(""));
  file.remove();
});

//下载歌曲
$(".song-btns-dl").on("click",function(e){
  if(!$(".active")[0]){
    e.preventDefault();
    alert("请先选择要下载的歌曲")
  }else{//确定下载
    $("#download").removeAttr("href");
    var move_floder=$(".choosed").children(".group-name").html();
    $(".active .song-name").each(function(){
      var path='/'+move_floder+'/'+$(this).html();
      $.ajax({
        type:"post",
        url:"json/dealDownload.json",
        data:{"path":path},
        dataType:"json",
        success:function(data){
          if(data.ret==0){
            var a = document.getElementById("download");
            a.href=data.url;
            a.download=data.filename;
            a.click();
          }else if(data.ret==-13){
            alert("下载出错")
          }
        }
      })
    })
  }
});