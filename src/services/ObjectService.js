import ApiService from './ApiService';

class ObjectService {

    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    getRelatedObjectEntries(objectEntryId, objectDefinitionAPIPath, relationshipName) {

        return ApiService.makeCall(this.baseURL + `/o/c/${objectDefinitionAPIPath}/${objectEntryId}?fields=${relationshipName}&nestedFields=${relationshipName}`, "GET")
            .then(data => {
                return data;
            }
        );
    }

    getAvailableRelatedObjectEntries(scopeKey, relatedObjectDefinitionAPIPath) {

        return ApiService.makeCall(this.baseURL + `/o/c/${relatedObjectDefinitionAPIPath}/scopes/${scopeKey}/?fields=title,id`, "GET")
            .then(data => {
                return data;
            }
        );
    }

    addRelatedObjectEntries(objectEntryId, objectDefinitionAPIPath, relationshipName, relatedObjectEntryIds) {
        
        const requests = relatedObjectEntryIds.map((relatedObjectEntryId) =>
            ApiService.makeCall(this.baseURL + `/o/c/${objectDefinitionAPIPath}/${objectEntryId}/${relationshipName}/${relatedObjectEntryId}`, "PUT")
        );

        return Promise.all(requests);
    }

    removeRelatedObjectEntry(objectEntryId, objectDefinitionAPIPath, relationshipName, relatedObjectEntryId) {
        
        return ApiService.makeCall(this.baseURL + `/o/c/${objectDefinitionAPIPath}/${objectEntryId}/${relationshipName}/${relatedObjectEntryId}`, "DELETE");

    }

}

export default ObjectService;