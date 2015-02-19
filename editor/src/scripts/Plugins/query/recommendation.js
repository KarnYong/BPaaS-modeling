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
					functionality : this.querying.bind(this),
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
	 * To do
	 */
	querying : function(processId) {
		// Ext.Msg.alert('Recommendation', 'Recommendation result.');
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
		var formPanel = new Ext.form.FormPanel({
			id : 'RecommendationFormPanel',
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
				listeners : {
					'select' : function() {
						formPanel.body.mask(ORYX.I18N.Query.pleaseWait,
								"x-waiting-box");
						// get max zone
						Ext.Ajax.request({
							url : prefix + 'query/',
							method : "GET",
							timeout : 1800000,
							disableCaching : true,
							headers : {
								'Accept' : "application/json",
								'Content-Type' : 'charset=UTF-8'
							},
							params : {
								id : 'getMaxZone',
								task : this.getValue().strip(),
								processID : modelMeta.name
							},
							success : function(transport) {
								formPanel.body.unmask();
								var zoneJson = transport.responseText
										.evalJSON();
								Ext.getCmp('zone').reset();
								var zoneCmp = Ext.getCmp('zone');
								var rt = Ext.data.Record.create([{
											name : 'id'
										}, {
											name : 'text'
										}]);
								var zoneStore = new Ext.data.Store({
											isAutoLoad : true,
											reader : new Ext.data.JsonReader({
														root : 'zone',
														fields : [{
																	name : 'id',
																	mapping : 'id'
																}, {
																	name : 'text',
																	mapping : 'text'
																}]
													}, rt)
										})
								zoneStore.loadData(zoneJson);
								zoneCmp.bindStore(zoneStore);
							},
							failure : function(transport) {
								formPanel.body.unmask();
								Ext.getCmp('zone').reset();
								var zoneCmp = Ext.getCmp('zone');
								var zoneStore = new Ext.data.SimpleStore({
											fields : ['id', 'text'],
											data : [['1', '1'], ['2', '2'],
													['3', '3'], ['4', '4'],
													['5', '5']]
										})
								zoneCmp.bindStore(zoneStore);
							}
						})
					}
				}
			}), new Ext.form.ComboBox({
				fieldLabel : ORYX.I18N.Query.zone,
				name : 'zone',
				id : 'zone',
				store : new Ext.data.SimpleStore({
							fields : ['id', 'text'],
							data : []
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
		var win = new Ext.Window({
			id : 'New_Query_Window',
			width : 'auto',
			height : 'auto',
			title : ORYX.I18N.Query.queryRecommendationDesc,
			modal : true,
			resizable : false,
			bodyStyle : 'background:#FFFFFF',
			items : [formPanel],
			defaultButton : 0,
			buttons : [{
				text : ORYX.I18N.Query.executeQueryBtn,
				handler : function() {
					win.body.mask(ORYX.I18N.Query.pleaseWait,
							"x-waiting-box");
	
					window.setTimeout(function() {
							}.bind(this), 10);
				}
			}, {
				text : ORYX.I18N.Save.close,
				handler : function() {
					win.close();
				}.bind(this)
			}],
			listeners : {
				close : function() {
					win.destroy();
					delete this.saving;
				}.bind(this)
			}
		});
		win.show();
	}

});