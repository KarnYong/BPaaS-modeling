package com.signavio.warehouse.query.handler;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.net.URLDecoder;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.signavio.platform.annotations.HandlerConfiguration;
import com.signavio.platform.handler.BasisHandler;
import com.signavio.platform.security.business.FsAccessToken;
import com.signavio.platform.security.business.FsSecureBusinessObject;
import com.signavio.platform.security.business.FsSecurityManager;
import com.signavio.platform.util.FileUtil;
import com.signavio.warehouse.directory.business.FsDirectory;
import com.signavio.warehouse.model.business.FsModel;
import com.signavio.warehouse.query.util.XMLUtil;
import com.signavio.warehouse.revision.business.FsModelRevision;
import com.signavio.warehouse.revision.business.RepresentationType;


@HandlerConfiguration(uri = "/query", rel = "que")
public class QueryHandler extends BasisHandler {

	public QueryHandler(ServletContext servletContext) {
		super(servletContext);
	}

	//////////////// DO GET ///////////////////////////////////////////////
	/**
	 * Overwrite
	 */
	public <T extends FsSecureBusinessObject> void doGet(
			HttpServletRequest req, HttpServletResponse res,
			FsAccessToken token, T sbo) {
		System.out.println("QueryHandler... doGet ");
		JSONObject jParams = (JSONObject) req.getAttribute("params");
		String jobDesc = "";
		try {
			jobDesc = jParams.getString("id");
		} catch (JSONException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}

		if (jobDesc.equals("getRecommendation")) {
			this.getRecommendation(jParams, req, res, token);
		}
	}

	private void getRecommendation(JSONObject jParams, HttpServletRequest req, HttpServletResponse res, FsAccessToken token) {
		try {
			String processPath = jParams.getString("processPath");
			
			JSONObject json = new JSONObject();
			JSONObject result = new JSONObject();			
    		
    		String modelSVG = getSvgRepresentation(new File(URLDecoder.decode(processPath, "UTF-8")));
    		String modelSVG2 = getSvgRepresentation(new File("C:\\repo\\Invoice\\BPaaS1.signavio.xml"));
    		
    		result.put("modelSVG", modelSVG);
    		result.put("modelSVG2", modelSVG2);
    		
			res.getWriter().write(result.toString());
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public String getSvgRepresentation(File fXmlFile) {
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder;
		String svgTxt = "";
		try {
			dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(fXmlFile);

			// normalize text representation
			doc.getDocumentElement().normalize();
			// System.out.println("Root element :"
			// + doc.getDocumentElement().getNodeName());

			// there is only one svg-representation tag
			NodeList svg = doc.getElementsByTagName("svg-representation");
			Node svgXml = svg.item(0);
			if (svgXml != null && svgXml.getNodeType() == Node.ELEMENT_NODE) {
				Element eSvgXml = (Element) svgXml;
				svgTxt = XMLUtil.getCharacterDataFromElement(eSvgXml);
			}
			
//			dBuilder = dbFactory.newDocumentBuilder();
//			InputSource is = new InputSource();
//			is.setCharacterStream(new StringReader(svgTxt));
//			svgTxt = XMLUtil.transformNodeToString(doc.getDocumentElement());
			
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return svgTxt;
	}

	/////////    DO POST //////////////////////////////////////
	/**
	 * Overwrite
	 */
	public <T extends FsSecureBusinessObject> void doPost(
			HttpServletRequest req, HttpServletResponse res,
			FsAccessToken token, T sbo) {
		System.out.println("QueryHandler... doPost ");
		// Get the parameter list
		JSONObject jParams = (JSONObject) req.getAttribute("params");
		String jobDesc = "";
		try {
			jobDesc = jParams.getString("jobId");
		} catch (JSONException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
	}
	
	/////////    DO PUT //////////////////////////////////////

	/**
	 * Overwrite
	 */
	public <T extends FsSecureBusinessObject> void doPut(
			HttpServletRequest req, HttpServletResponse res,
			FsAccessToken token, T sbo) {
		System.out.println("QueryHandler... doPut ");
		// Get the parameter list
		JSONObject jParams = (JSONObject) req.getAttribute("params");
		String jobDesc = "";
		try {
			jobDesc = jParams.getString("jobId");
		} catch (JSONException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
	}
	
	/**
	 * Overwrite
	 */
	public <T extends FsSecureBusinessObject> void doDelete(
			HttpServletRequest req, HttpServletResponse res,
			FsAccessToken token, T sbo) {
		System.out.println("QueryHandler... doDelete ");
		// Get the parameter list
		JSONObject jParams = (JSONObject) req.getAttribute("params");
		String jobDesc = "";
		try {
			jobDesc = jParams.getString("id");
		} catch (JSONException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
	}
}
