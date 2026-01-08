import React from "react";
import { createRoot } from "react-dom/client";
import ManyToMany from "./ManyToMany";

class ManyToManyWebComponent extends HTMLElement {

    constructor() {
        super();
        this._reactRoot = null;
        this._rootInstance = null;
    }

    connectedCallback() {
        if (!this.querySelector('.react-root')) {
            const reactRoot = document.createElement('div');
            reactRoot.className = 'react-root';
            this.appendChild(reactRoot);
        }

        this._renderReact();
    }

    disconnectedCallback() {
        if (this._rootInstance) {
            this._rootInstance.unmount();
            this._rootInstance = null;
        }
    }

    _renderReact() {
        const reactRoot = this.querySelector('.react-root');
        if (reactRoot) {
            if (!this._rootInstance) {
                this._rootInstance = createRoot(reactRoot);
            }

            const props = this._getPropsFromAttributes();

            this._rootInstance.render(
                <ManyToMany {...props} />
            );
        }
    }

    _getPropsFromAttributes() {
        return {
            currentObjectEntryERC: this.getAttribute("current-object-entry-erc"),
            currentObjectEntryId: this.getAttribute("current-object-entry-id"),
            currentObjectEntryAPIPath: this.getAttribute("current-object-entry-api-path"),
            relatedObjectEntryAPIPath: this.getAttribute("related-object-entry-api-path"),
            objectRelationshipName: this.getAttribute("object-relationship-name"),
            baseURL: this.getAttribute("base-url")
        };
    }
}

const MANY_TO_MANY_ELEMENT_ID = "many-to-many";
if (!customElements.get(MANY_TO_MANY_ELEMENT_ID)) {
    customElements.define(MANY_TO_MANY_ELEMENT_ID, ManyToManyWebComponent);
}