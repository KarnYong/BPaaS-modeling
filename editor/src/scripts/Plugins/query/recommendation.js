if (!ORYX.Plugins)
	ORYX.Plugins = new Object();

ORYX.Plugins.Recommendation = Clazz.extend({

	// Defines the facade
	facade : undefined,

	// Constructor
	construct : function(facade) {

		this.facade = facade;

		// Offers the functionality of undo
		this.facade.offer({
					name : ORYX.I18N.Query.recommendation,
					description : ORYX.I18N.Query.recommendationDesc,
					icon : ORYX.PATH + "images/query/recommendation.png",
					functionality : this.queryRecommend.bind(this),
					group : ORYX.I18N.Query.group,
					isEnabled : function() {
						return true;
					}.bind(this),
					index : 1
				});
	},

	findAllTasks: function (tasks, children){
		for(var i=0; i<children.length; i++){
			if(children[i].stencil.id == 'Pool' || children[i].stencil.id == 'Lane'){
				this.findAllTasks(tasks, children[i].childShapes);
			}else if(children[i].stencil.id == 'Task' || children[i].stencil.id == 'CollapsedSubprocess'){
		    	tasks.push(children[i].properties.name);
		    }else if(children[i].stencil.id == 'Function'){
		    	tasks.push(children[i].properties.title);
		    }
		}
	},
	
	/**
	 * querying
	 */
	queryRecommend : function(processId) {
		// Ext.Msg.alert('Recommendation', 'Recommendation result.');
		
		// Collapse south panel if it expands
		var southPanel = Ext.getCmp('southPanel');
		if (southPanel.collapsed == false)
			southPanel.toggleCollapse();
		
		var modelMeta = this.facade.getModelMetaData();
		var reqURI = modelMeta.modelHandler;
		var reqURIs = reqURI.split("/");
		var prefix = "/";
		for (i = 1; i < reqURIs.length - 1; i++) {
			prefix += reqURIs[i] + "/";
		}

		var modelJSON = this.facade.getJSON();
		var canvasChilds = modelJSON.childShapes;
		var tasks = [];
		this.findAllTasks(tasks, canvasChilds);

		var taskTxt = "";
		if (tasks.length > 0) {
			taskTxt = "["
		}
		for (i = 0; i < tasks.length; i++) {
			taskTxt += "['" + tasks[i].strip() + "', '" + tasks[i].strip()
					+ "'],";
		}
		if (tasks.length > 0) {
			taskTxt = taskTxt.substring(0, taskTxt.length - 1) + "]";
		}

		// create form
		var queryRecommendFormPanel = new Ext.form.FormPanel({
			id : 'queryRecommendFormPanel',
			bodyStyle : 'padding:10px',
			width : 'auto',
			height : 'auto',
			items : [new Ext.form.ComboBox({
				fieldLabel : ORYX.I18N.Query.selectTask,
				name : 'task',
				id : 'task',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'text'],
							data : eval(taskTxt)
						}),
				allowBlank : false,
				autoWidth : true,
				emptyText : '-- select --',
				valueField : 'id',
				displayField : 'text',
				mode : 'local',
				triggerAction : 'all',
			}), new Ext.form.ComboBox({
				fieldLabel : ORYX.I18N.Query.zone,
				name : 'zone',
				id : 'zone',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'text'],
							data : [['1', '1'], ['2', '2'],
									['3', '3'], ['4', '4'],
									['5', '5']]
						}),
				allowBlank : false,
				emptyText : '-- select --',
				valueField : 'id',
				displayField : 'text',
				mode : 'local',
				triggerAction : 'all'
			})]
		});

		// Create new window and attach form into it
		var queryRecommendWindow = new Ext.Window({
			id : 'queryRecommendWindow',
			width : 'auto',
			height : 'auto',
			title : ORYX.I18N.Query.queryRecommendationDesc,
			modal : true,
			resizable : false,
			bodyStyle : 'background:#FFFFFF',
			items : [queryRecommendFormPanel],
			defaultButton : 0,
			buttons : [{
				text : ORYX.I18N.Query.executeQueryBtn,
				handler : function() {
					this.createSouthPanel();
					queryRecommendWindow.close();
				}.bind(this)
			}, {
				text : ORYX.I18N.Save.close,
				handler : function() {
					queryRecommendWindow.close();
				}.bind(this)
			}],
			listeners : {
				close : function() {
					queryRecommendWindow.destroy();
					delete this.saving;
				}.bind(this)
			}
		});
		queryRecommendWindow.show();
	},
    
	/**
	 * create south panel 
	 * added by Karn Yongsiriwit
	 * */
	createSouthPanel: function(){
		var queryRecommendFormPanel = Ext.getCmp('queryRecommendFormPanel');
		queryRecommendFormPanel.body.mask(ORYX.I18N.Query.pleaseWait, "x-waiting-box");
	   	Ext.Ajax.request({
   			url				: ORYX.CONFIG.SERVER_HANDLER_ROOT + '/query/',
   			method			: "GET",
   			timeout			: 1800000,
   			disableCaching	: true,
   			headers			: {'Accept':"application/json", 'Content-Type':'charset=UTF-8'},
   			params			: {
   								id: 'getRecommendation',
								processPath: decodeURIComponent(window.location.href.split("?id=")[1]).replace(/;/g, '\\')
				              },
   			success			: function(transport) {
				   				var resJSON = transport.responseText.evalJSON();
								// Create a Template
								var dataDefault1 = {svg:resJSON.modelSVG};
						   		var dialogIn1 = new Ext.XTemplate(	
						   			'<div onmouseover="this.childNodes[1].style.display=\'inline\';" onmouseout="this.childNodes[1].style.display=\'none\';">',
						   				'<div></div>',
					        			'<span style="display:none; position:absolute; top:6px; left:20px;">',
										'<img src="../explorer/src/img/famfamfam/zoom_in.png" onmouseover="this.style.cursor=\'pointer\';" ',
									 		' onclick= "',
									 		'this.nextSibling.nextSibling.value = parseFloat(this.nextSibling.nextSibling.value) + 0.1;',
											'var size = this.nextSibling.nextSibling.value;',
											'var sizeTxt = \'scale(\'+size+\')\';',
											'document.getElementById(\'svgCanvas1\').childNodes[0].childNodes[1].setAttribute(\'transform\',sizeTxt);',
											'"',
										'/>',
										'<img src="../explorer/src/img/famfamfam/zoom_out.png" onmouseover="this.style.cursor=\'pointer\';" ',
									 		' onclick= "',
									 		'this.nextSibling.value = parseFloat(this.nextSibling.value) - 0.1;',
											'var size = this.nextSibling.value;',
											'var sizeTxt = \'scale(\'+size+\')\';',
											'document.getElementById(\'svgCanvas1\').childNodes[0].childNodes[1].setAttribute(\'transform\',sizeTxt);',
										'"',
										'/>',
										'<input type="hidden" value="1.0"/>',
									'</span>',
										'<div id="svgCanvas1" style="text-align: center; align: center; margin: 0 auto;">{svg}</div>',
									'</div>'
								);
						   		
						   		var dataDefault2 = {svg:resJSON.recommends[0].svg};
						   		var dialogIn2 = new Ext.XTemplate(	
						   			'<div onmouseover="this.childNodes[1].style.display=\'inline\';" onmouseout="this.childNodes[1].style.display=\'none\';">',
						   				'<div></div>',
					        			'<span style="display:none; position:absolute; top:6px; left:20px;">',
										'<img src="../explorer/src/img/famfamfam/zoom_in.png" onmouseover="this.style.cursor=\'pointer\';" ',
									 		' onclick= "',
									 		'this.nextSibling.nextSibling.value = parseFloat(this.nextSibling.nextSibling.value) + 0.1;',
											'var size = this.nextSibling.nextSibling.value;',
											'var sizeTxt = \'scale(\'+size+\')\';',
											'document.getElementById(\'svgCanvas2\').childNodes[0].childNodes[1].setAttribute(\'transform\',sizeTxt);',
											'"',
										'/>',
										'<img src="../explorer/src/img/famfamfam/zoom_out.png" onmouseover="this.style.cursor=\'pointer\';" ',
									 		' onclick= "',
									 		'this.nextSibling.value = parseFloat(this.nextSibling.value) - 0.1;',
											'var size = this.nextSibling.value;',
											'var sizeTxt = \'scale(\'+size+\')\';',
											'document.getElementById(\'svgCanvas2\').childNodes[0].childNodes[1].setAttribute(\'transform\',sizeTxt);',
										'"',
										'/>',
										'<input type="hidden" value="1.0"/>',
									'</span>',
										'<div id="svgCanvas2" style="text-align: center; align: center; margin: 0 auto;">{svg}</div>',
									'</div>'
								);
						   		
						   		var rt = Ext.data.Record.create([
   		              			    {name: 'process'},
   		              			    {name: 'task'},
   		              			    {name: 'zone'},
   		              			    {name: 'sim'},
   		              			    {name: 'svg'}
   		              			]);
   		              			var resultStore = new Ext.data.Store ({
   		              				isAutoLoad: true,
   		              			    reader: new Ext.data.JsonReader({
   		              			    	root: 'recommends',
   		              				    fields: [
   		              				        {name: 'process', mapping: 'process'},
   		              				        {name: 'task', mapping: 'task'},
   		              				        {name: 'zone', mapping: 'zone'},
   		              				        {name: 'sim', mapping: 'sim'},
   		              				        {name: 'svg', mapping: 'svg'}
   		              				    ]},rt)
   		              			});
   		              			resultStore.loadData(resJSON);
	   		              		var setSVGToSVGPanel2 = function(smObject, rowIndex, record){
									var dataDefault2 = {svg:record.get('svg')};
									var dialogIn2 = new Ext.XTemplate(	
										'<div onmouseover="this.childNodes[1].style.display=\'inline\';" onmouseout="this.childNodes[1].style.display=\'none\';">',
											'<div></div>',
											'<span style="display:none; position:absolute; top:6px; left:20px;">',
											'<img src="../explorer/src/img/famfamfam/zoom_in.png" onmouseover="this.style.cursor=\'pointer\';" ',
												' onclick= "',
												'this.nextSibling.nextSibling.value = parseFloat(this.nextSibling.nextSibling.value) + 0.1;',
												'var size = this.nextSibling.nextSibling.value;',
												'var sizeTxt = \'scale(\'+size+\')\';',
												'document.getElementById(\'svgCanvas2\').childNodes[0].childNodes[1].setAttribute(\'transform\',sizeTxt);',
												'"',
											'/>',
											'<img src="../explorer/src/img/famfamfam/zoom_out.png" onmouseover="this.style.cursor=\'pointer\';" ',
												' onclick= "',
												'this.nextSibling.value = parseFloat(this.nextSibling.value) - 0.1;',
												'var size = this.nextSibling.value;',
												'var sizeTxt = \'scale(\'+size+\')\';',
												'document.getElementById(\'svgCanvas2\').childNodes[0].childNodes[1].setAttribute(\'transform\',sizeTxt);',
											'"',
											'/>',
											'<input type="hidden" value="1.0"/>',
										'</span>',
											'<div id="svgCanvas2" style="text-align: center; align: center; margin: 0 auto;">{svg}</div>',
										'</div>'
									);

									var svgPanel2 = Ext.getCmp('svgPanel2');
									var svgPanel2Parent = Ext.getCmp('svgPanel2Parent');
									if(svgPanel2){
										svgPanel2Parent.remove(svgPanel2);
		   			        		}
																		
									svgPanel2 = new Ext.Panel({
										id: 'svgPanel2',
										autoScroll: true,
 										html: dialogIn2.apply(dataDefault2),
										bodyStyle:    'background-color:#FFFFEF'
									});
									svgPanel2Parent.add(svgPanel2);
									svgPanel2Parent.doLayout();
									
								}.bind(this);
							
		   		              	var recommendsGrid = new Ext.grid.GridPanel({
		   		     				id:	'recommendsGrid',
		   		     			    store: resultStore,
		   		     			    autoScroll: true,
		   		     			    colModel: new Ext.grid.ColumnModel({
		   		     			    	defaultSortable: true,
		   		     			    	defaults: {
		   		     			            sortable: true
		   		     			        },
		   		     					
		   		     					columns: [
		   		     						{id: 'process', width: 100, header: 'Process', dataIndex: 'process', type:'string', 
		   		     							renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		   		     								return value;
		   		     							}
		   		     						}, 
		   		     						{id: 'task', width: 200, header: 'Task', dataIndex: 'task', type:'string', 
		   		     							renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		   		     								return value;
		   		     							}
		   		     						}, 
		   		     						{id: 'zone', width: 50, header: 'Zone', dataIndex: 'zone', type:'string', 
		   		     							renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		   		     								return value;
		   		     							}
		   		     						}, 
		   		     			            {id: 'sim', width: 50, header: 'Sim', dataIndex: 'sim', type:'string', 
		   		     			            	renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		//   		     			            		metaData.attr = 'ext:qtip="' + value + '"';
		   		     			            		return value;
		   		     			            	}
		   		     			            }
//		   		     			            {id: 'svg', width: 12, header: 'SVG', dataIndex: 'svg', type:'svg', 
//		   		     			            	renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
//		//   		     			            		metaData.attr = 'ext:qtip="' + value + '"';
//		   		     			            		return value;
//		   		     			            	}
//		   		     			            }
		   		     		            ]
		   		     			    }),
		   		     			    viewConfig: {
		   		     			        forceFit: true,
		   		     			    },
		   		     			    sm: new Ext.grid.RowSelectionModel({
		   		     	                singleSelect: true,
		   		     	                listeners: {
		   		     	                     rowselect: setSVGToSVGPanel2
		   		     	                }
		   		     	            }),
		   		     			    region: 'center',
		   		     			    iconCls: 'icon-grid'
		   		     			});								
				
								var svgPanel1 = new Ext.Panel({
									id: 'svgPanel1',
									autoScroll: true,
									html: dialogIn1.apply(dataDefault1),
									bodyStyle:    'background-color:#FFFFFE'
								});
															
								var svgPanel2 = new Ext.Panel({
									id: 'svgPanel2',
									autoScroll: true,
									html: dialogIn2.apply(dataDefault2),
									bodyStyle:    'background-color:#FFFFFE'
								});
								
								var recommendsGridPanel = new Ext.Panel({
						   			id: 'recommendsGridPanel',
									title: 'Recommendation',
									width: 500,
									region	: 'center',
									autoScroll: true,
									items: [recommendsGrid]
								});
								
								var svgPanel1Parent = new Ext.Panel({
						   			id: 'svgPanel1Parent',
									title: 'Selected process fragment',
									width: 500,
									region	: 'west',
									autoScroll: true,
									items: [svgPanel1]
								});
								
								var svgPanel2Parent = new Ext.Panel({
						   			id: 'svgPanel2Parent',
									title: 'Recommended process fragment',
									width: 500,
									region	: 'east',
									autoScroll: true,
									items: [svgPanel2]
								});
									
								var recommendationPanel = new Ext.Panel({
									id : 'recommendationPanel',
									layout:'border',
									defaults: {
										collapsible: true,
										split: true
									},
									width: 'auto',
									height: 'auto',
									items: [svgPanel1Parent, recommendsGridPanel, svgPanel2Parent]
								});
				
								var southTabPanel = Ext.getCmp('southTabPanel');
								if (southTabPanel)
									southTabPanel.destroy();
				
								southTabPanel = new Ext.TabPanel({
									id: 'southTabPanel',
									activeTab: 0,
									items: [{
										title: ORYX.I18N.Query.recommendationDesc,
										layout: 'fit',
										items: [recommendationPanel]
									}]
								});
				
								var southPanel = Ext.getCmp('southPanel');
								southPanel.add(southTabPanel);
								southPanel.doLayout();
								southPanel.expand(true);
							  },
   			failure			: function(transport) {
   								Ext.Msg.alert('Recommendation', 'Recommendation failure.');
							  }
   		})
	},
});