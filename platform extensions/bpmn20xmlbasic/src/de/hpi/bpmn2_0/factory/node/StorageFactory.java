package de.hpi.bpmn2_0.factory.node;

import org.oryxeditor.server.diagram.generic.GenericShape;

import de.hpi.bpmn2_0.annotations.StencilId;
import de.hpi.bpmn2_0.exceptions.BpmnConverterException;
import de.hpi.bpmn2_0.factory.AbstractShapeFactory;
import de.hpi.bpmn2_0.model.BaseElement;
import de.hpi.bpmn2_0.model.cloudresource.Storage;
/**
 * The factory for storage
 * 
 * @author Karn Yongsiriwit
 *
 */
@StencilId("storage")
public class StorageFactory extends AbstractShapeFactory {

	@Override
	protected BaseElement createProcessElement(GenericShape shape)
			throws BpmnConverterException {
		
		try {
			Storage storage = new Storage();
			storage.setId(shape.getResourceId());		
			String capacity = shape.getProperty("capacity");
			storage.setCapacity(capacity);
			
			return storage;
		} catch (Exception e) {
			throw new BpmnConverterException(
					"Error while creating the process element of "
							+ shape.getStencilId(), e);
		}
	}
}
