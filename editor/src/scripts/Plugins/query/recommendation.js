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
		var sounthPanel = Ext.getCmp('sounthPanel');
		if (sounthPanel.collapsed == false)
			sounthPanel.toggleCollapse();
		
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
   		//create a tree node
   		var recommendationTreeNode = new Ext.tree.AsyncTreeNode({
			expanded:true,
			leaf:false,
			text:'Root queries'
   		});
	
   		//create a tree
   		var recommendationTreePanel = new Ext.tree.TreePanel({
   			id: 'recommendationTreePanel',
		  	loader: new Ext.tree.TreeLoader(),
		  	rootVisible: false,
		  	lines: false,
			autoScroll: true,
			layout: 'fit',
			animate: true,
			width: 200,
			minSize: 200,
			maxSize: 500,
			region	: 'center',
			root: recommendationTreeNode,
   		});
   		
   		var svgPanel1 = new Ext.Panel({
   			id: 'svgPanel1',
			width: 500,
			region	: 'west',
			autoScroll: true,
			layout: 'fit',
			bodyStyle: 'background-color:#FF0000',
		});
   		
   		var svgPanel2 = new Ext.Panel({
   			id: 'svgPanel2',
			width: 500,
			region	: 'east',
			autoScroll: true,
			layout: 'fit',
			bodyStyle: 'background-color:#E6FF00',
		});
   		
		var recommendationPanel = new Ext.Panel({
			layout:'border',
		    defaults: {
		        collapsible: true,
		        split: true
		    },
		    width: 'auto',
		    height: 'auto',
		    items: [svgPanel1, recommendationTreePanel, svgPanel2]
		});
		
	    
	    var southTabPanel = Ext.getCmp('southTabPanel');
	    if (southTabPanel)
			southTabPanel.destroy();
	    
		southTabPanel = new Ext.TabPanel({
			id: 'southTabPanel',
		    activeTab: 0,
			items: [{
		    	id : 'recommendationPanel',
		        title: ORYX.I18N.Query.recommendationDesc,
		        layout: 'fit',
		        items: [recommendationPanel]
		    }]
	    });
		
		var sounthPanel = Ext.getCmp('sounthPanel');
		sounthPanel.add(southTabPanel);
		sounthPanel.doLayout();
		sounthPanel.expand(true);
	},
});