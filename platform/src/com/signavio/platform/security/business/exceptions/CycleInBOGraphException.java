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
package com.signavio.platform.security.business.exceptions;


public class CycleInBOGraphException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3990909925784427458L;

//	public CycleInBOGraphException(BusinessInstance parent, BusinessInstance child) {
//		super("Adding " + child.getId() + " to " + parent.getId() + " would create a cycle in the BO Graph.");
//	}

	public CycleInBOGraphException() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CycleInBOGraphException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

	public CycleInBOGraphException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	public CycleInBOGraphException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}
	
	
}
