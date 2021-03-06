/*******************************************************************************
 * Signavio Core Components
 * Copyright (C) 2012  Signavio GmbH
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
package de.hpi.bpmn2_0.model.artifacts;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlIDREF;
import javax.xml.bind.annotation.XmlRootElement;

import de.hpi.bpmn2_0.model.CategoryValue;
import de.hpi.bpmn2_0.transformation.Visitor;


/**
 * <p>Java class for tTextAnnotation complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="tTextAnnotation">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.omg.org/bpmn20}tArtifact">
 *       &lt;sequence>
 *         &lt;element ref="{http://www.omg.org/bpmn20}text" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Group
    extends Artifact
{
	
	 @XmlAttribute(name = "categoryValueRef")
	 @XmlIDREF
	    protected CategoryValue categoryValueRef;

	    /**
	     * Gets the value of the categoryValueRef property.
	     * 
	     * @return
	     *     possible object is
	     *     {@link CategoryValue }
	     *     
	     */
	    public CategoryValue getCategoryValueRef() {
	        return categoryValueRef;
	    }

	    /**
	     * Sets the value of the categoryValueRef property.
	     * 
	     * @param value
	     *     allowed object is
	     *     {@link CategoryValue }
	     *     
	     */
	    public void setCategoryValueRef(CategoryValue value) {
	        this.categoryValueRef = value;
	    }
	
		public void acceptVisitor(Visitor v){
			v.visitGroup(this);
		}



}
