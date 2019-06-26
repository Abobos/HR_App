import sendErrorResponse, { sendSuccessResponse } from '../helpers/sendResponse';
import propertyService from '../services/propertyService';

export default class PropertyController {
  static postPropertyAdvert(req, res) {
    const response = propertyService.postPropertyAdvert(req.body);
    return sendSuccessResponse(res, response.code, response.token, response.data);
  }

  static updatePropertyAdvert(req, res) {
    const { propertyId } = req.params;
    const { price } = req.body;
    const response = propertyService.updatePropertyAdvert(propertyId, price);
    if (response.error) return sendErrorResponse(res, response.code, response.error);
    return sendSuccessResponse(res, response.code, response.token, response.data);
  }

  static markPropertyAdvert(req, res) {
    const { propertyId } = req.params;
    const response = propertyService.markPropertyAdvert(propertyId);
    if (response.error) return sendErrorResponse(res, response.code, response.error);
    return sendSuccessResponse(res, response.code, response.token, response.data);
  }

  static deletePropertyAdvert(req, res) {
    const { propertyId } = req.params;
    const response = propertyService.deletePropertyAdvert(propertyId);
    if (response.error) return sendErrorResponse(res, response.code, response.error);
    return sendSuccessResponse(res, response.code, response.token, response.data);
  }

  static getSpecificPropertiesAdvert(query) {
    const response = propertyService.getSpecificPropertiesAdvert(query);
    return response;
  }

  static getPropertiesAdvert(req, res) {
    let response;
    if (req.query.type) response = PropertyController.getSpecificPropertiesAdvert(req.query);
    else { 
      response = propertyService.getPropertiesAdvert();
    }
    return sendSuccessResponse(res, response.code, response.token, response.data);
  }

  static getSpecificPropertyDetails(req, res) {
    const { propertyId } = req.params;
    const response = propertyService.getSpecificPropertyDetails(propertyId);
    if (response.error) return sendErrorResponse(res, response.code, response.error);
    return sendSuccessResponse(res, response.code, response.token, response.data);
  }
}
