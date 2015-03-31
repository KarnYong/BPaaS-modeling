package de.hpi.bpmn2_0.model.cloudresource;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import de.hpi.bpmn2_0.model.FlowNode;

/**
 * <p>Java class for tStorage complex type.
 * 
 * @author Karn Yongsiriwit
 *
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "tStorage")
public class Storage
extends FlowNode
{
	@XmlAttribute
    protected String capacity;

	public String getCapacity() {
        return capacity;
    }

    public void setCapacity(String value) {
        this.capacity = value;
    }
}
