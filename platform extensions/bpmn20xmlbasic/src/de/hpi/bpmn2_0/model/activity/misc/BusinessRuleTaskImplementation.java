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
package de.hpi.bpmn2_0.model.activity.misc;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;


/**
 * <p>Java class for tUserTaskImplementation.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="tUserTaskImplementation">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="unspecified"/>
 *     &lt;enumeration value="other"/>
 *     &lt;enumeration value="webService"/>
 *     &lt;enumeration value="humanTaskWebService"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlEnum
public enum BusinessRuleTaskImplementation {

    @XmlEnumValue("unspecified")
    UNSPECIFIED("unspecified"),
    @XmlEnumValue("other")
    OTHER("other"),
    @XmlEnumValue("webService")
    WEB_SERVICE("webService"),
    @XmlEnumValue("businessRuleTaskWebService")
    BUSINESS_RULE_TASK_WEB_SERVICE("BuisnessRuleWebService");
    private final String value;

    BusinessRuleTaskImplementation(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static BusinessRuleTaskImplementation fromValue(String v) {
        for (BusinessRuleTaskImplementation c: BusinessRuleTaskImplementation.values()) {
            if (c.value.equalsIgnoreCase(v)) {
                return c;
            } else {
            	/* Return default value otherwise */
            	return OTHER;
            }
            	
        }
        throw new IllegalArgumentException(v);
    }

}


