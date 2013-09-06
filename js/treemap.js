/**
 * 在 jquery-treemap.js上进去二次开发
 * 添加显示图片，最小显示块优化等功能 tl
 * 区域块添加修改和删除功能按钮，与具体业务想关联。如需使用，需要再次开发
 * BG_COLORS 默认参数给出区域块的可显示颜色范围，随机获取到
 */
(function($) {
	//定义公用参数对象
	var ARG = {
		rect : {
			'margin' : 10,
			'minArea' : 0,
			'minRatio' : 0.15,
			'imgSrcEx' : "../images/infoeditor/404.jpg",
			'imgTitleHeight' : 20
		},
		treemap : {
			'BG_COLORS' : ['bg_c1','bg_c2','bg_c3','bg_c4'],
			'SIDE_MARGIN' : 20,
			'TOP_MARGIN' : 20,
			'HORIZONTAL' : 1,
			'VERTICAL' : 2,
			'nodeLabel_width_padding' : 10
		},
		Math : {
			countMinArea : function(width,height){
				ARG.rect.minArea = Math.round((width*ARG.rect.minRatio)*(height*ARG.rect.minRatio));
			},
			randomColors : function(){
				var length = ARG.treemap.BG_COLORS.length;
				var random = Math.floor(Math.random()*length);
		    	
		    	return ARG.treemap.BG_COLORS[random];
			}
		},
		animate : {
			/**
		     * 用于节点区域的动画
		     */
			nodeAnimate : function($toHide,width){
				$toHide.animate({
					"left" : -width
				}, {
					"duration" : "slow",
					"easing" : "easeOutExpo",
					"complete" : function() {
						
					}
				});
		    },
		    updateTopicForOk : function(node,$box){
		    	var $treemapBut = $box.find(".treemap-but");
		    	
		    	$treemapBut.show();
				var $treemapContent = $box.find(".treemap-content");
				ARG.animate.nodeAnimate($treemapContent,0);
	     		ARG.event.bindNodeEvent(node,$box);
		    }
		},
		event : {
			/**
		     * 绑定节点相关事件,订制
		     */
		    bindNodeEvent : function(node,$box){
			 	var nodeBounds = node.bounds;
			    var $butContent = $box.find(".treemap-but");
			
				$box.mouseenter(function() {
					var id = setTimeout(function(){
						$butContent.fadeIn("fast");
					},200);
					$box.data("timeOutId",id);
					
				}).mouseleave(function() {
					var timeOutId = $box.data("timeOutId");
					clearTimeout(timeOutId);
					
					$butContent.fadeOut("fast");
				});
				
				$box.click(function(){
					console.log("具体区域块点击后，所需进行的操作 ！！！！");
				});
			 },
			 bindEditEvent : function(node,$edit){
				//保存事件
		     	var $saveBut = $edit.find(".saveBut");
		     	var $box = $edit.parents(".treemap-node");
		     	
		     	$saveBut.click(function(event){    		
		     		event.stopPropagation();
		     		
		     		var $treemapLabel = $box.find(".treemap-label");
					var $treemapEdit = $box.find(".treemap-edit");
					var $treemapBut = $box.find(".treemap-but");
					
					var _name = $.trim($treemapEdit.find("._name").val());
					var _title = $.trim($treemapEdit.find("._title").val());
					var id = node.id;
					
					if(_name !== node.name || _title !== node.title){
						var conditions = {};
						conditions['id'] = id;
						conditions['name'] = _name;
						conditions['title'] = _title;
						
						ARG.data.updateTopic(conditions,function(data){
							if(data && data.res === 'ok'){
								ARG.animate.updateTopicForOk(node,$box);
								
								node.name = _name;
								node.title = _title;
								
								var $treemapNode = $("#"+id);
								
								$treemapNode.attr("title",_title);
								$treemapNode.find(".treemap-img-title").text(_title);
								$treemapNode.find(".treemap-name").text(_name);
								$treemapNode.find(".treemap-title").text(_title);
							}else{
								var $tip = $treemapEdit.find(".tip");
								$tip.show().text("保存操作异常，请稍后重试!!!");
								
								setTimeout(function(){
									$tip.fadeOut().text("");
								},3000);
							}
						});
					}else{
						ARG.animate.updateTopicForOk(node,$box);
					}
		     	});
		    },
		    bindDelButHoverAndClick : function($butContent, node) {
		        var nodeBounds = node.bounds;
		        var $box = $butContent.parent();
		   		
				$box.mouseenter(function() {
					var id = setTimeout(function(){
						$butContent.fadeIn("fast");
					},200);
					$box.data("timeOutId",id);
					
				}).mouseleave(function() {
					var timeOutId = $box.data("timeOutId");
					clearTimeout(timeOutId);
					
					$butContent.fadeOut("fast");
				});
		      	
				//删除按钮
				$butContent.find("i.icon-remove").click(function(){
					console.log("实现删除区域块功能 ！！！！");
					return false;
				});
				
				//编辑按钮
				$butContent.find("i.icon-edit").click(function(){
					$box.unbind();
					
					var $treemapLabel = $box.find(".treemap-label");
					var $treemapEdit = $box.find(".treemap-edit");
					var $treemapBut = $box.find(".treemap-but");
					var $treemapContent = $box.find(".treemap-content");
					
					$treemapBut.hide();
					var width = $box.width();
					var height = $box.height();
					
					ARG.animate.nodeAnimate($treemapContent,width);
					return false;
				});
		    }
		},
		pingDiv : {
			createEditDiv : function(node,$edit){
		     	var $tip = $("<div class='tip'></div>");
				var $fieldset = $("<fieldset></fieldset>");
				var $butDiv = $("<div class='butDiv'></div>");
				
				var $labelName =  $("<label for='name' class='_label'>关键词:</label>");
				var $inputName =  $("<textarea name='name' id='name' placeholder='请输入关键词!!!' title='关键词' type='text' class='_input _name'>"+node.name+"</textarea>");
				var $labelTitle =  $("<label for='title' class='_label'>标题:</label>");
				var $inputTitle =  $("<textarea name='title' id='title' placeholder='请输入标题!!!' title='标题' type='text' class='_input _title'>"+node.title+"</textarea>");
				
				var $saveBut = $("<input type='button' value='保存' class='btn saveBut'></input>");
				
				$fieldset.append($inputName).append($inputTitle);
				$butDiv.append($saveBut);
				$edit.append($tip).append($fieldset).append($butDiv);
		     }
		},
		data : {
			updateTopic : function(conditions,callback){
				console.log("更新数据处理区域，需自己实现 callback ！！！");
				
				callback.call(this,conditions);
			}
		}
	};
	
    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Rectangle.prototype.style = function() {
        return {
            top: this.y + 'px',
            left: this.x + 'px',
            width: (this.width - ARG.rect.margin) + "px",
            height: (this.height - ARG.rect.margin) + "px"
        };
    }

    Rectangle.prototype.isWide = function() {
        return this.width >= this.height;
    }
    
    Rectangle.prototype.area = function(){
    	return this.width * this.height;
    }
    
    function TreeMap($div, options) {
        var options = options || {};
        this.$div = $div;

        $div.css('position', 'relative');
        this.rectangle = new Rectangle(1, 0, $div.width(), $div.height());

        this.nodeClass = function() {
            return '';
        }
        this.click = function() {
        };
        this.mouseenter = function() {
        };
        this.mouseleave = function() {
        };
        this.mousemove = function() {
        };
        this.paintCallback = function() {
        };
        this.ready = function() {
        };

        $.extend(this, options);

        this.setNodeColors = function($box) {
        	$box.addClass('treemap-node');
			$box.addClass(ARG.Math.randomColors());
        }
    }
    
    TreeMap.prototype.paint = function(nodeList) {
        var nodeList = this.squarify(nodeList, this.rectangle);

        for (var i = 0; i < nodeList.length; i++) {
            var node = nodeList[i];
            var nodeBounds = node.bounds;
			
            var $box = $('<div id=' + node.id + '></div>');
            $box.css($.extend(nodeBounds.style(), {
                'position' : 'absolute'
            }));
            $box.attr("title",node.title);

            this.setNodeColors($box,i);

            var self = this;
            $box.bind('click', node, function(e) {
                self.click(e.data, this);
            });
            $box.bind('mouseenter', node, function(e) {
                self.mouseenter(e.data, e);
            });
            $box.bind('mouseleave', node, function(e) {
                self.mouseleave(e.data, e);
            });
            $box.bind('mousemove', node, function(e) {
                self.mousemove(e.data, e);
            });

            $box.appendTo(this.$div);
            $box.addClass(this.nodeClass(node, $box));

            var $butContent = $("<div class='treemap-but'><a class='treemap-iconLink'><i class='icon-edit treemap-icon'></i></a><a class='treemap-iconLink'><i class='icon-remove treemap-icon'></i></a></div>");
            $box.append($butContent);
            
//            if (SecurityUtils.hasRole("ROLE_ADDMONITORDOCUMENT")) {
	            ARG.event.bindDelButHoverAndClick($butContent, node);
//            }
            
	        var boxWidth = nodeBounds.width - ARG.rect.margin;
	        var boxHeight = nodeBounds.height - ARG.rect.margin;
	        
            var $treemapContent = $("<div class='treemap-content'></div>");
            $treemapContent.css({"width":(nodeBounds.width*2 - ARG.rect.margin)+"px","height":boxHeight+"px"});
            $box.append($treemapContent);
            
            var $content = $("<div class='treemap-label'></div>");
            $treemapContent.append($content);
            
            //这里需要分析有图片的情况，显示图片数据
            if(node.imageList){
	        	$content.css({"width":boxWidth + "px","height":boxHeight + "px"});
            	
            	this.createImgDiv(node,$content);
            }else{
            	$content.css({"width":(boxWidth - ARG.treemap.nodeLabel_width_padding*2)+"px","height":boxHeight + "px"});
	            
	            var $name = $("<div class='treemap-name'></div>").append(node.name);
	            var $title = $("<div class='treemap-title'></div>").append(node.title);
	            $content.append($name).append($title);
	            
	            this.fitLabelFontSize($content, node);
	            
	            //对应负值的情况，一律做0处理
//	            $content.css('margin-top', ((parseInt($box.height()) / 2) - (parseInt($content.height()) / 2)) < 0 ? 0 : ((parseInt($box.height()) / 2) - (parseInt($content.height()) / 2)) + 'px');
	            $content.css('margin-top', "4%");
            }
            
            //添加编辑区域
            var $edit = $("<div class='treemap-edit'></div>");
            
            $treemapContent.append($edit);
            $edit.css({"width":boxWidth + "px","height":boxHeight + "px","left":boxWidth + "px"});
           	
            ARG.pingDiv.createEditDiv(node,$edit);
            ARG.event.bindEditEvent(node,$edit);
        }
        this.ready();
    }
    
    /**
     * 构建图片显示区域，获取图片本身的大小和显示区域大小。缩放图片，避免失真
     */
    TreeMap.prototype.createImgDiv = function(node,$content){
    	var nodeBounds = node.bounds;
    	var imageList = node.imageList;
    	
    	var imgSrc;
    	try{
	    	imgSrc = JSON.parse(imageList)[0];
    	}catch(e){
    		imgSrc = ARG.rect.imgSrcEx;
    	}
    	
        var $imgDiv = $("<div class='imgDiv'></div>");
    	var $title = $("<div class='treemap-img-title'></div>").append(node.title);
    	$title.addClass(ARG.Math.randomColors());
    	
    	this.fetchImgSize(imgSrc,function(size){
    		var imgStyle;
			if (size && size.width > 0 && size.height > 0) {
				//console.log(titleImgUrl, size);
				if (size.height * nodeBounds.width / size.width >= nodeBounds.height) {
					imgStyle = "width:" + nodeBounds.width + "px";
				} else {
					imgStyle = "height:" + nodeBounds.height + "px";
				}
				
				if(size.width > nodeBounds.width){
					$imgDiv.css("width",size.width - ARG.rect.margin + "px");
				}else{
					$imgDiv.css("width",nodeBounds.width - ARG.rect.margin + "px");
				}
				
				if(size.height > nodeBounds.height){
					$imgDiv.css("height",size.height - ARG.rect.margin + "px");
				}else{
					$imgDiv.css("height",nodeBounds.height - ARG.rect.margin + "px");
				}
			} else {
				//console.log(titleImgUrl, "unknow size.");
				imgSrc = ARG.rect.imgSrcEx;
				$imgDiv.css({"width":(nodeBounds.width - ARG.rect.margin)+"px","height":(nodeBounds.height - ARG.rect.margin)+"px"});
				imgStyle = "width: " + nodeBounds.width + "px; height:" + nodeBounds.height + "px";
			}
			
			setTimeout(function() {
				var $img = $("<img style='" + imgStyle + "' src='" + imgSrc + "' />");
				$content.append($imgDiv.append($img).append($title));
				
				delete imgStyle;
			}, 20);
			
	    	$content.css("margin-left",0);
	    	$content.css("margin-right",0);
    	});
    	
    	this.fitLabelFontSize($content, node);
    }

    /**
	 * 获取指定图片Url的尺寸大小
	 * 
	 * @param imageUrl {string} 图片URL
	 * @param callBack {function} 获取取图片的尺寸后所调用的回调方法（参数：{width, height}）
	 * @return null
	 */
	TreeMap.prototype.fetchImgSize = function(imageUrl, callBack){
		// 非正确数值，直接返回
		if (!imageUrl) {
			callBack();
			return;
		}
		
		var img = new Image(), timeId = 0, fineshed;
		//var start_time = new Date().getTime();
		
		img.src = imageUrl;
		
		if (img.complete) {
			//console.log("from complete:", new Date().getTime() - start_time, img.width, img.height);
			callBack({
				width : img.width,
				height : img.height
			});
		} else {
			timeId = setTimeout(function() {
				// 只要任何一方大于0，表示已经服务器已经返回宽高
				if (img.width > 0 || img.height > 0) {
					//console.log("from check:", new Date().getTime() - start_time, img.width, img.height);
					fineshed = true;
					callBack({
						width : img.width,
						height : img.height
					});
				} else {
					//console.log("--from check down:", new Date().getTime() - start_time, img.width, img.height);
					timeId = setTimeout(arguments.callee, 40);
				}
			}, 40);
			
			img.onload = function() {
				//console.log("from load:", new Date().getTime() - start_time, img.width, img.height);
				clearTimeout(timeId);
				if (!fineshed) {
					callBack({
						width : img.width,
						height : img.height
					});
				}
			};
			img.onerror = function() {
				//console.log("image load error.");
				clearTimeout(timeId);
				if (!fineshed) {
					callBack();
				}
			};
		}
	}
    
    TreeMap.prototype.fitLabelFontSize = function($content, node) {
        var nodeBounds = node.bounds;
        var $box = $content.parent();
        
        var size = Math.floor(Math.sqrt(nodeBounds.width*nodeBounds.height)*0.15);
        
//        console.log($box.height(),$box.width(),nodeBounds,$content.height());
        
        if((parseInt($box.height()) / 2) - (parseInt($content.height()) / 2) < 0){
        	size = Math.floor(Math.sqrt($box.height()*$box.width())*0.13);
        }
        
        $content.css('font-size',size+'px');
        
        this.paintCallback($content, node);
    }

    TreeMap.prototype.squarify = function(nodeList, rectangle) {
        nodeList.sort(function(a, b) {
            return Number(b.size) - Number(a.size);
        });
        this.divideDisplayArea(nodeList, rectangle);

        return nodeList;
    };

    TreeMap.prototype.divideDisplayArea = function(nodeList, destRectangle) {
        // Check for boundary conditions
        if (nodeList.length === 0) return;

        if (nodeList.length == 1) {
            nodeList[0].bounds = destRectangle;
            return;
        }

        var useAverageStrategy = this.minRectAreaDivideStrategy(nodeList,destRectangle);
		
        if(useAverageStrategy){
        	var averageSum = this.sumValues(nodeList);
        	var averagePoint = Math.round(destRectangle.height/nodeList.length);

        	//使用平均策略，横向切分区域
        	for (var i = 0; i < nodeList.length; i++){
        		this.divideDisplayArea(nodeList.slice(i,i+1), new Rectangle(destRectangle.x, destRectangle.y + averagePoint*i, destRectangle.width, averagePoint));
        	}
        	return;
        }
        
        var halves = this.splitFairly(nodeList);

        var midPoint;
        var orientation;
        
        var leftSum = this.sumValues(halves.left),
            rightSum = this.sumValues(halves.right),
            totalSum = leftSum + rightSum;
		
        if (leftSum + rightSum <= 0) {
            midPoint = 0;
            orientation = ARG.treemap.HORIZONTAL;
        } else {
			//横切策略大于竖切策略，计算切割点和方向
            if (destRectangle.isWide()) {
                orientation = ARG.treemap.HORIZONTAL;
                midPoint = Math.round(( leftSum * destRectangle.width ) / totalSum);
            } else {
                orientation = ARG.treemap.VERTICAL;
                midPoint = Math.round(( leftSum * destRectangle.height ) / totalSum);
            }
        }

        if (orientation === ARG.treemap.HORIZONTAL) {
            this.divideDisplayArea(halves.left, new Rectangle(destRectangle.x, destRectangle.y, midPoint, destRectangle.height));
            this.divideDisplayArea(halves.right, new Rectangle(destRectangle.x + midPoint, destRectangle.y, destRectangle.width - midPoint, destRectangle.height));
        } else {
            this.divideDisplayArea(halves.left, new Rectangle(destRectangle.x, destRectangle.y, destRectangle.width, midPoint));
            this.divideDisplayArea(halves.right, new Rectangle(destRectangle.x, destRectangle.y + midPoint, destRectangle.width, destRectangle.height - midPoint));
        }
    };
    
    //最小矩形块策略，当剩下的面积小于一定值时。启动
    TreeMap.prototype.minRectAreaDivideStrategy = function(nodeList,destRectangle){
    	var useAverageStrategy = false;
    	var minArea = parseInt(nodeList.length * ARG.rect.minArea);
    	var rectArea = parseInt(destRectangle.width * destRectangle.height);
    	
    	if(minArea > rectArea){
    		useAverageStrategy = true;
    	}
    	return useAverageStrategy;
    };
    
	//2分法
    TreeMap.prototype.splitFairly = function(nodeList) {
        var halfValue = this.sumValues(nodeList) / 2;
        var accValue = 0;
        var length = nodeList.length;

        for (var midPoint = 0; midPoint < length; midPoint++) {
            if (midPoint > 0 && ( accValue + Number(nodeList[midPoint].size) > halfValue ))
                break;
            accValue += Number(nodeList[midPoint].size);
        }
        
        return {
            left: nodeList.slice(0, midPoint),
            right: nodeList.slice(midPoint)
        };
    };

    TreeMap.prototype.sumValues = function(nodeList) {
        var result = 0;
        var length = nodeList.length;
        for (var i = 0; i < length; i++){
	        result += Number(nodeList[i].size);
        }
        return result;
    };
  
    $.fn.treemap = function(json, options) {
        var self = $(this);
        
        ARG.Math.countMinArea(self.width(),self.height());
        
        return this.fadeOut('fast', function() {
            self.empty().fadeIn('fast', function() {
                new TreeMap(self, options).paint(json);
            });
        });
    };
})(jQuery);