Ext.namespace("com.walker.file.message");
com.walker.file.message.queryFormPnl = null;
com.walker.file.message.messageGridPnl = null;
com.walker.file.message.messageFormPnl = null;

com.walker.file.message.recData=null;

com.walker.file.message.mainPanel=function(obj){
	var tools = [];
	var item = [com.walker.file.message.getGridPnl()];
	//显示工具栏
	if(obj.flag != 1){
		tools = [{
			text : '新增',
			iconCls : 'btnIconAddIn',
			id : "2000101",
			hidden : true,
			handler : function() {
				com.walker.file.message.editMessage("add");
			}
		},'-',{
			text : '编辑',
			iconCls : 'btnIconUpdate',
			id : "2000102",
			hidden : true,
			handler : function() {
				com.walker.file.message.editMessage("edit");
			}
		},'-',{
			text : '删除',
			iconCls : 'btnIconDel',
			id : "2000103",
			hidden : true,
			handler : function() {
				com.walker.file.message.deleteMessage();
			}
		},{
			text : '导入',
			iconCls : 'btnIconImport',
			id : "2000104",
			hidden : true,
			handler : function() {
				com.walker.file.message.openInput();
			}
		},{
			text : '导出',
			iconCls : 'btnExcelPage',
			id : "2000105",
			hidden : true,
			menu: {
	            items: [
					{
					    text: '到本地',
						iconCls : 'btnExcelPage',
					    handler : function() {
					    	com.walker.file.message.exportExcel();
						}
					}, {
	                    text: '到FTP',
	        			iconCls : 'btnExcelPage',
	        			handler : function() {
	        				com.walker.file.message.exportExcelToFtp();
	        			}
	                }
	             ]              
			}
		},{
			text : '导出PDF',
			iconCls : 'btnPdf',
			id : "2000106",
			hidden : true,
			menu: {
	            items: [
					{
					    text: '到本地',
						iconCls : 'btnPdf',
					    handler : function() {
					    	com.walker.file.message.exportPDF();
						}
					}, {
	                    text: '到FTP',
	        			iconCls : 'btnPdf',
	        			handler : function() {
	        				com.walker.file.message.exportPDFToFtp();
	        			}
	                }
	             ]              
			}
		},{
			text : '导出统计表PDF',
			iconCls : 'btnPdf',
			id : "2000107",
			hidden : true,
			menu: {
	            items: [
					{
					    text: '到本地',
						iconCls : 'btnPdf',
					    handler : function() {
					    	com.walker.file.message.exportListPDF();
						}
					}, {
	                    text: '到FTP',
	        			iconCls : 'btnPdf',
	        			handler : function() {
	        				com.walker.file.message.exportListPDFToFtp();
	        			}
	                }
	             ]              
			}
		},'->',{
			xtype : 'button',
			iconCls : 'btnIconSearch',
			text : '查询',
			handler : function() {
				com.walker.file.message.queryMessage();
			}
		},'-',{
			xtype : 'button',
			iconCls : 'btnIconRecover',
			text : '重置',
			handler : function() {
				Ext.getCmp("name_input").setValue();
			}
		}];
		item = [ com.walker.file.message.getQueryForm(),com.walker.file.message.getGridPnl()];
	}
	var mainPanel = new Ext.Panel( {
		layout : 'border',
		border : false,
		region : 'center',
		tbar: tools,
		items : item
	});
	return mainPanel;
};

com.walker.file.message.getQueryForm = function(){
	
	var queryForm = new Ext.Panel({
		id : 'messageSearchPanel',
		layout : 'column',
		region : 'north',
		rowHeight : 0,
		frame:true,
		buttonAlign : 'left',
		autoHeight:false,
		height:40,
		items : [{
			layout : 'form',
			autoHeight : true,
			border : false,
			width : 250,
			labelWidth : 80,
			labelAlign : 'right',
			items : [{
				xtype : 'textfield',
				fieldLabel : '名称',
				name : 'name',
				id:'name_input',
				anchor : '100%'
			}]
		}]
	});
	
	com.walker.file.message.queryFormPnl = queryForm;
	return queryForm;
};

com.walker.file.message.getGridPnl = function(){
	
	var reader = new Ext.data.JsonReader({
		fields : ["id","name","age","sex","picture_03","picture_04","data_flag","details"],
		root : 'rows',
		id : 'ID',
		totalProperty : 'total'
	});
	var store = new Ext.data.Store({
		url : '/jkcms/file/getMessageListPage',
		reader : reader,
		baseParams : {
			limit : 15,
			start: 0
		}
	});
	// 创建列模型的多选框模型.
    var sm = new Ext.grid.CheckboxSelectionModel();	
	var model = new Ext.grid.ColumnModel([sm,
              new Ext.grid.RowNumberer({
		  	  	header : "序号",
					align : 'left',
					width : 40,
					renderer : function(value, metadata, record,rowIndex) {
						var startRow = '';
						if(store.lastOptions.params){
							startRow =store.lastOptions.params.start;
							if (isNaN(startRow)) {
								startRow = 0;
							}
						}else{
							startRow = 0;
						}
						return startRow + rowIndex + 1;
					}
			}),{
				header : "ID",
				dataIndex : "id",
				sortable : true,
				hidden : true,
				width : 100,
				align : 'center'
			},{
				header : "版本号",
				dataIndex : "version",
				sortable : true,
				hidden : true,
				width : 120,
				align : 'left'
			},{
				header : "名称",
				dataIndex : "name",
				sortable : true,
				width : 120,
				align : 'left'
			}, {
				header : "年龄",
				dataIndex : "age",
				sortable : true,
				width : 50,
				align : 'center'
			}, {
				header : "性别",
				dataIndex : "sex",
				sortable : true,
				width : 50,
				align : 'center'
			},{
				header : "大图",
				align : 'center',
				sortable : false,
				dataIndex : 'picture_03',
				align : 'left',
				width : 220,
				renderer : function(value, metadata, record, rowIndex, columnIndex, store){
					if(value) {
						var resloution = '480*660';
						var width = 200;
						var height = 200;
						
						var resloutions = resloution.split("*");
						if(resloutions.length == 2) {
							var rwidth = parseInt(resloutions[0]);
							var rheight = parseInt(resloutions[1]);
							if (rwidth <= 200) {
								width = rwidth;
								height = rheight;
							}
							else {
								height = parseInt(width / rwidth * rheight);
							}
						}
						
						var html = "<div style='padding-top: 3px;padding-bottom: 3px;'>" 
							+ "<img src=" + value +" width='" + width + "' height='" + height + "' /></div>";
						metadata.attr = ' ext:qtip="' + html + '"';
					}
					return value;
				}
			},{
				header : "缩略图",
				align : 'center',
				sortable : false,
				dataIndex : 'picture_03',
				align : 'center',
				width : 220,
				renderer : function(value, metadata, record, rowIndex, columnIndex, store){
					if(value) {
						var resloution = '120*165';
						var width = 200;
						var height = 200;
						
						var resloutions = resloution.split("*");
						if(resloutions.length == 2) {
							var rwidth = parseInt(resloutions[0]);
							var rheight = parseInt(resloutions[1]);
							if (rwidth <= 200) {
								width = rwidth;
								height = rheight;
							}
							else {
								height = parseInt(width / rwidth * rheight);
							}
						}
						
						var html = "<div style='padding-top: 3px;padding-bottom: 3px;'>" 
							+ "<img src=" + value +" width='" + width + "' height='" + height + "' /></div>";
						metadata.attr = ' ext:qtip="' + html + '"';
					}
					return value;
				}
			},{
				header : "数据状态",
				dataIndex : "data_flag",
				sortable : true,
				width : 80,
				align : 'center',
				renderer : function(value) {
					if (value == 0) {
						return '<font color="black">未上线</font>';
					}else if (value == 1) {
						return '<font color="green">已上线</font>';
					}
					return "";
				}
			},{
				header : "介绍",
				dataIndex : "details",
				sortable : true,
				width : 220,
				align : 'center'
			}
	]);
	
	var grid = new Ext.grid.GridPanel({
			layout : 'fit',
			title : '项目列表',
			autoWidth : true,
			autoScroll : true,
			cm : model,
			sm : sm,
			store : store,
			stripeRows : true,
			region : 'center',
			bodyStyle : 'padding:5px 5px',
			bbar : new Ext.PagingToolbar({
				pageSize : 15,
				store : store,
				displayInfo : true,
				region : 'center'
			})
	});
	
	com.walker.file.message.messageGridPnl = grid;
	grid.store.load();
	return grid;
};

com.walker.file.message.queryMessage = function() {
	com.walker.file.message.messageGridPnl.store.baseParams.name = Ext.getCmp("name_input").getValue();
	com.walker.file.message.messageGridPnl.store.load();
};

com.walker.file.message.title=null;
com.walker.file.message.creayteType=null;


com.walker.file.message.editMessage = function(types) {
	com.walker.file.message.creayteType=types;
	if(types == "edit")
	{
		var rec = com.walker.common.getSelectRecord(com.walker.file.message.messageGridPnl,true);
		if(rec){
			Ext.Ajax.request({
				url: '/jkcms/file/getMessageById',
				params : {
					id:rec.get('id')
				},
				success: function(response) {
					var result = Ext.util.JSON.decode(response.responseText);
					if(result.success){
						com.walker.file.message.recData=result.data;
						com.walker.file.message.title="修改项目";
						com.walker.file.message.showRecordWin();
					}else{
						Ext.Msg.alert("提示",result.err_msg);
					}
			     },
				failure: function(response) {		
					Ext.Msg.alert("提示","获取信息失败");
				}
			});
		}
	}else{
		com.walker.file.message.title="新增信息";
		com.walker.file.message.showRecordWin();
	}
};
com.walker.file.message.editWin=null;
com.walker.file.message.showRecordWin=function(){
	com.walker.file.message.editWin=com.walker.file.message.createEditWin();
	if(com.walker.file.message.creayteType=="edit"){
		com.walker.file.message.messageFormPnl.find("name", "id")[0].setValue(com.walker.file.message.recData.id);
		com.walker.file.message.messageFormPnl.find("name", "version")[0].setValue(com.walker.file.message.recData.version);
		com.walker.file.message.messageFormPnl.find("name", "name")[0].setValue(com.walker.file.message.recData.name);
		com.walker.file.message.messageFormPnl.find("name", "age")[0].setValue(com.walker.file.message.recData.age);
		com.walker.file.message.messageFormPnl.findByType("radiogroup")[0].setValue(com.walker.file.message.recData.sex);
		com.walker.file.message.messageFormPnl.find("name", "details")[0].setValue(com.walker.file.message.recData.details);
	}
	com.walker.file.message.editWin.show();
};


com.walker.file.message.createEditWin=function(){
	var panelTmp = new Ext.Window({
		layout : 'fit',
		width : 500,
		height : 300,
		modal : true,
		constrain : true,
//		maximizable: true,  
//		maximized :true,
		closeAction:'close',
		title : com.walker.file.message.title,
		tbar : [ {
			text : '保存',
			iconCls : 'btnIconSave',
			handler : function() {
				com.walker.file.message.saveMessage();
			}
		},'-',{
			text : '取消',
			iconCls : 'btnIconReset',
			handler : function() {
				com.walker.file.message.editWin.close();
			}
		} ],
		items : [com.walker.file.message.editWinForm()]
	});
	return panelTmp;
	
};

com.walker.file.message.editWinForm=function(){
	
	var messageFormPnl = new Ext.form.FormPanel({
	    width : 500,
	    height : 300,
	    frame : true,
	    labelWidth : 80,
	    labelAlign : "right",
	    autoScroll:true, 
//	    fileUpload : true,
        border: false,  
	    items : [
            {	layout : "form",
            	items : [{
            		xtype : "textfield",
	         	    fieldLabel : 'ID',
	         	    name : 'id',
	         	    hidden: true
            	}]
            },{	
            	layout : "form",
            	items:[{
            		xtype : "textfield",
		         	fieldLabel : '版本号',
		         	name : 'version',
		         	hidden: true
            	}]
            },{	
            	layout : "form",
            	items:[{
            		xtype : "textfield",
	         		fieldLabel : '名称',
	         		name : 'name',
	         		maxLength:'32',
	         		allowBlank : false
            	}]
            },{	
            	layout : "form",
            	items:[{
            		xtype : "textfield",
		     		fieldLabel : '年龄',
		     		name : 'age',
		     		allowBlank : true
            	}]
            },{
    		    layout : "form",
    		    items : new Ext.form.RadioGroup({
    		    	fieldLabel: '性别',
    		    	width: 100,
    		    	items: [{
    					    name: 'sex',
    					    inputValue: '1',
    					    boxLabel: '男',
    					    checked: true
    				   },{
    				    	name: 'sex',
    				    	inputValue: '2',
    				    	boxLabel: '女'
    				   }]
    		    	})
    	    },{
   				layout : "form",
            	items:[{
            		xtype : "textarea",
			        fieldLabel : "介绍",
			        name : "details",
			        allowBlank : true,
			        anchor : '90%',
			        height : 140
            	}]
			}
   ]
	});
	com.walker.file.message.messageFormPnl = messageFormPnl;
	return messageFormPnl;
};

com.walker.file.message.saveMessage=function(){
	if(com.walker.file.message.messageFormPnl.getForm().isValid()){
		var sumBtn = function(btn){
			if(btn!='yes'){return;}
			com.walker.file.message.messageFormPnl.getForm().submit({
				method:"POST",
				waitMsg:"保存中,请稍后...",
				url : "/jkcms/file/saveMessage",
				success: function(form, action) {
						if(action.result.success){
							Ext.Msg.alert("提示","保存成功" ,function() {
								com.walker.file.message.editWin.close();
							});
							com.walker.file.message.queryMessage();
						} else {
							Ext.Msg.alert("提示", action.result.err_msg);
						}
				     },
				 failure: function(form, action) {
			    	 Ext.Msg.alert("提示","保存失败");
				 }
			});
		};
		Ext.Msg.confirm('提示',"确定保存吗？",sumBtn);
	}
};

com.walker.file.message.deleteMessage=function(){
	var selRecords= com.walker.common.getSelectRecord(com.walker.file.message.messageGridPnl,false);
	if(!selRecords){
		return;
	}
	
	var ids="";
	for ( var i = 0; i < selRecords.length; i++) {
		
		if(selRecords[i].data.code!=null){
			
		}
		ids += ","+selRecords[i].data.id;
	}
	var sumBtn = function(btn){
		if(btn != 'yes'){
			return;
		}
		Ext.Ajax.request( {
			url : '/jkcms/file/deleteMessage',
			success : function(response) {
				var result = Ext.decode(response.responseText);
				if (result.success) {
					Ext.Msg.alert("提示", "删除成功!");
					com.walker.file.message.queryMessage();
				}else{
					Ext.Msg.alert("提示", result.err_msg);
				}
			},
			failure : function(response) {
				Ext.Msg.alert("提示", "删除失败!");
			},
			params : {
				ids : ids.substring(1)
			}
		});
	};
	Ext.Msg.confirm('系统提示',"确定删除吗?",sumBtn);
};

com.walker.file.message.win=null;

com.walker.file.message.openInput=function(){
	com.walker.file.message.win=com.walker.file.message.createInputWin();
	com.walker.file.message.win.show();
};

com.walker.file.message.createInputWin = function(){
	var panelTmp = new Ext.Window({
		layout : 'fit',
		width : 450,
		height : 120,
		modal : true,
		constrain : true,
		closeAction:'close',
		title : '导入文件',
		tbar : [ {
			text : '导入',
			iconCls : 'btnIconSave',
			handler : function() {
				com.walker.file.message.fileInput();
			}
		},'-',{
			text : '取消',
			iconCls : 'btnIconReset',
			handler : function() {
				com.walker.file.message.win.close();
			}
		} ],
		items : [com.walker.file.message.inputWinForm()]
	});
	return panelTmp;
};

com.walker.file.message.formPanel=null;
com.walker.file.message.inputWinForm=function(){
	var formPnl = new Ext.form.FormPanel({
	    width : 450,
	    height : 120,
	    frame : true,
	    layout : "form",
	    labelWidth : 80,
	    fileUpload: true,
	    enctype:"multipart/form-data",
	    items : [{
	          layout : "form",
	          items : [{
			      xtype : 'textfield',
		    	  allowBlank:false,
	              fieldLabel:'选择文件',
	              inputType:'file',
	              name:'filePath',
	              id:'filePath',
	              anchor : '80%'
	          }]
	    }]
	});
	com.walker.file.message.formPanel= formPnl;
	return formPnl;
};

com.walker.file.message.fileInput=function(){

	com.walker.file.message.formPanel.getForm().submit({
		url:'/jkcms/file/importExcel',
		method :'POST',
		waitMsg:"导入中,请稍后...",
		success: function(form ,action) {		
			if(action.result.success){
				Ext.Msg.alert("提示","数据导入成功" ,function() {
					com.walker.file.message.win.close();
				});
				com.walker.file.message.queryMessage();
			}else{
				Ext.Msg.alert("提示",action.result.err_msg);
			}
	    },
		failure: function(response) {
			Ext.Msg.alert("提示","数据导入失败!");
		}	
	});
};

com.walker.file.message.exportExcel=function(){
	var records = com.walker.common.getSelectRecord(com.walker.file.message.messageGridPnl,false);
	if(records.length > 0)
	{
		var sumBtn = function(btn){
			if(btn!='yes'){return;}
			
			var ids="";
			for (var i = 0; i < records.length; i++) {
				ids += ","+records[i].data.id;
			}
			var exportUrl = "/jkcms/file/exportExcel?ids="+ ids.substring(1);
			window.location.href = exportUrl;
		};
		Ext.Msg.confirm('系统提示',"确定导出Excel文件吗?",sumBtn);
	}else{
		Ext.Msg.alert("提示","请至少选择一条记录！");
	}
}

com.walker.file.message.exportExcelToFtp=function(){
	var selRecords= com.walker.common.getSelectRecord(com.walker.file.message.messageGridPnl,false);
	if(!selRecords){
		return;
	}
	
	var ids="";
	for ( var i = 0; i < selRecords.length; i++) {
		
		if(selRecords[i].data.code!=null){
			
		}
		ids += ","+selRecords[i].data.id;
	}
	var sumBtn = function(btn){
		if(btn != 'yes'){
			return;
		}
		Ext.Ajax.request( {
			url : '/jkcms/file/exportExcelToFtp',
			success : function(response) {
				var result = Ext.decode(response.responseText);
				if (result.success) {
					Ext.Msg.alert("提示", "导出成功!");
					com.walker.file.message.queryMessage();
				}else{
					Ext.Msg.alert("提示", result.err_msg);
				}
			},
			failure : function(response) {
				Ext.Msg.alert("提示", "导出失败!");
			},
			params : {
				ids : ids.substring(1)
			}
		});
	};
	Ext.Msg.confirm('系统提示',"确定导出Excel文件吗?",sumBtn);
};

com.walker.file.message.exportPDF=function(){
	var rec = com.walker.common.getSelectRecord(com.walker.file.message.messageGridPnl,true);
	if(rec){
		var sumBtn = function(btn){
			if(btn!='yes'){return;}
			var exportUrl = "/jkcms/file/exportPDF?id=" + rec.get('id');
			window.location.href = exportUrl;
		};
		Ext.Msg.confirm('系统提示',"确定导出PDF文件吗?",sumBtn);
	}else{
		Ext.Msg.alert("提示","请至少选择一条记录！");
	}
}

com.walker.file.message.exportPDFToFtp = function() {
	var rec = com.walker.common.getSelectRecord(com.walker.file.message.messageGridPnl,true);
	if(rec){
		var sumBtn = function(btn){
			if(btn != 'yes'){
				return;
			}
			Ext.Ajax.request({
				url: '/jkcms/file/exportPDFToFtp',
				params : {
					id:rec.get('id')
				},
				success: function(response) {
					var result = Ext.util.JSON.decode(response.responseText);
					if(result.success){
						Ext.Msg.alert("提示","导出PDF成功!");
					}else{
						Ext.Msg.alert("提示",result.err_msg);
					}
			     },
				failure: function(response) {		
					Ext.Msg.alert("提示","导出PDF发生错误！");
				}
			});
		};
		Ext.Msg.confirm('系统提示',"确定导出PDF文件吗?",sumBtn);
	}
};

com.walker.file.message.exportListPDF=function(){
	var records = com.walker.common.getSelectRecord(com.walker.file.message.messageGridPnl,false);
	if(records.length > 0)
	{
		var sumBtn = function(btn){
			if(btn!='yes'){return;}
			var ids="";
			for (var i = 0; i < records.length; i++) {
				ids += ","+records[i].data.id;
			}
			var exportUrl = "/jkcms/file/exportListPDF?ids="+ ids.substring(1);
			window.location.href = exportUrl;
		};
		Ext.Msg.confirm('系统提示',"确定导出Excel文件吗?",sumBtn);
	}else{
		Ext.Msg.alert("提示","请至少选择一条记录！");
	}
}

com.walker.file.message.exportListPDFToFtp=function(){
	var selRecords= com.walker.common.getSelectRecord(com.walker.file.message.messageGridPnl,false);
	if(!selRecords){
		return;
	}
	
	var ids="";
	for ( var i = 0; i < selRecords.length; i++) {
		ids += ","+selRecords[i].data.id;
	}
	var sumBtn = function(btn){
		if(btn != 'yes'){
			return;
		}
		Ext.Ajax.request( {
			url : '/jkcms/file/exportListPDFToFtp',
			success : function(response) {
				var result = Ext.decode(response.responseText);
				if (result.success) {
					Ext.Msg.alert("提示", "导出统计表PDF成功!");
					com.walker.file.message.queryMessage();
				}else{
					Ext.Msg.alert("提示", result.err_msg);
				}
			},
			failure : function(response) {
				Ext.Msg.alert("提示", "导出统计表失败!");
			},
			params : {
				ids : ids.substring(1)
			}
		});
	};
	Ext.Msg.confirm('系统提示',"确定导出Excel文件吗?",sumBtn);
};

Ext.onReady(function() {
	var obj = {};
	obj.flag = 0;
	Ext.QuickTips.init();
	new Ext.Viewport({
		id : 'row-panel',
		bodyStyle : 'padding:5px',
		layout : 'fit',
		title : 'Row Layout',
		items : [{
			rowHeight : 0,
			xtype : 'panel',
			layout : 'border',
			items : [com.walker.file.message.mainPanel(obj)]
		}]
	});
	com.walker.permission.userpermission("20001");
});