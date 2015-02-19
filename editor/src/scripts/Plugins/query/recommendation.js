if (!ORYX.Plugins) 
    ORYX.Plugins = new Object();

ORYX.Plugins.Recommendation = Clazz.extend({
        
  // Defines the facade
  facade                : undefined,
        
  // Constructor 
  construct: function(facade){
    
    this.facade = facade;     
                
    // Offers the functionality of undo                
    this.facade.offer({
      name              : ORYX.I18N.Query.recommendation,
      description       : ORYX.I18N.Query.recommendationDesc,
      icon              : ORYX.PATH + "images/query/recommendation.png",
      functionality     : this.querying.bind(this),
	  group				: ORYX.I18N.Query.group,
	  isEnabled			: function(){ return true; }.bind(this),
	  index				: 1
    }); 
  },
	
  /**
   * To do
   * */
  querying: function(processId){
    Ext.Msg.alert('Recommendation', 'Recommendation result.');
  }
  
});