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
				
    		
    		String modelSVG = getSvgRepresentation(new File(URLDecoder.decode(processPath, "UTF-8")));
    		String modelSVG2 = getSvgRepresentation(new File("C:\\repo\\Invoice\\BPaaS2.signavio.xml"));
    		JSONArray recommendsJSON = getRecommendationJSON();

			JSONObject result = new JSONObject();		
    		result.put("modelSVG", modelSVG);
    		result.put("recommendsJSON", recommendsJSON);
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
	
	public JSONArray getRecommendationJSON() {
		JSONArray recommendsJSON = new JSONArray();
		try {
			JSONObject recommendJSON1 = new JSONObject();
			recommendJSON1.put("processID", "C:\\repo\\Invoice\\BPaaS1.signavio.xml");
			recommendJSON1.put("rootTask", "Send Promotion");
			recommendJSON1.put("zone", "2");
			recommendJSON1.put("text", "1. BPaaS1 - Send Promotion (radius: 2, sim: 0.6)");
			recommendJSON1.put("icon", "../editor/images/box.png");
			recommendJSON1.put("leaf", true);
			recommendJSON1.put("cls", "QueryEntree");
			recommendsJSON.put(recommendJSON1);
			
			JSONObject recommendJSON2 = new JSONObject();
			recommendJSON2.put("processID", "C:\\repo\\Invoice\\BPaaS2.signavio.xml");
			recommendJSON2.put("rootTask", "Invoice notification");
			recommendJSON2.put("zone", "2");
			recommendJSON2.put("text", "2. BPaaS1 - Send Promotion (radius: 3, sim: 0.3)");
			recommendJSON2.put("icon", "../editor/images/box.png");
			recommendJSON2.put("leaf", true);
			recommendJSON2.put("cls", "QueryEntree");
			recommendsJSON.put(recommendJSON2);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return recommendsJSON;
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
