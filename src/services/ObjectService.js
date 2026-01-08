import ApiService from './ApiService';

class ObjectService {

    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    getObjectEntryScopeKey(objectEntryId, objectDefinitionAPIPath) {

        return ApiService.makeCall(this.baseURL + `${objectDefinitionAPIPath}/${objectEntryId}?fields=scopeId`, "GET")
            .then(data => {
                return data.scopeId;
            }
        );
    }

    getRelatedObjectEntries(objectEntryId, objectDefinitionAPIPath, relationshipName, page, pageSize) {

        return ApiService.makeCall(this.baseURL + `${objectDefinitionAPIPath}/${objectEntryId}/${relationshipName}?page=${page}&pageSize=${pageSize}`, "GET")
            .then(data => {
                return data;
            }
        );
    }

    getAvailableRelatedObjectEntries(scopeKey, relatedObjectDefinitionAPIPath, page, pageSize) {

        return ApiService.makeCall(this.baseURL + `${relatedObjectDefinitionAPIPath}/scopes/${scopeKey}/?fields=title,id&page=${page}&pageSize=${pageSize}`, "GET")
            .then(data => {
                return data;
            }
        );
    }

    addRelatedObjectEntries(objectEntryId, objectDefinitionAPIPath, relationshipName, relatedObjectEntryIds) {
        
        const requests = relatedObjectEntryIds.map((relatedObjectEntryId) =>
            ApiService.makeCall(this.baseURL + `${objectDefinitionAPIPath}/${objectEntryId}/${relationshipName}/${relatedObjectEntryId}`, "PUT")
        );

        return Promise.all(requests);
    }

    removeRelatedObjectEntry(objectEntryId, objectDefinitionAPIPath, relationshipName, relatedObjectEntryId) {
        
        return ApiService.makeCall(this.baseURL + `${objectDefinitionAPIPath}/${objectEntryId}/${relationshipName}/${relatedObjectEntryId}`, "DELETE");

    }

}

export default ObjectService;