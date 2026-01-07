import React, { useState, useMemo, useEffect, useCallback } from "react";
import Icon, { ClayIconSpriteContext } from "@clayui/icon";
import List from '@clayui/list';

import Toolbar from '@clayui/toolbar';
import {ClayInput} from '@clayui/form';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayButton, {ClayButtonWithIcon} from '@clayui/button';

import '@clayui/css/lib/css/atlas.css';
import ObjectService from "./services/ObjectService";
import AddItemModal from "./AddItemModal";

const ManyToMany = ({ baseURL, scopeKey, currentObjectEntryId, currentObjectEntryERC, currentObjectEntryAPIPath, relatedObjectEntryAPIPath, objectRelationshipName }) => {

    const [ objectService, setObjectService ] = useState(null);
    const [ addItemToggle, setAddItemToggle ] = useState(false);
    
    const [ availableRelatedObjectEntries, setAvailableRelatedObjectEntries ] = useState([]);
    const [ relatedObjectEntries, setRelatedObjectEntries ] = useState([]);

    useEffect(() => {

        setObjectService(new ObjectService(baseURL));

    }, [baseURL]);

    useEffect(() => {

        if(objectService != null) {

            objectService.getRelatedObjectEntries(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName).then(data => {
                setRelatedObjectEntries(data['actorFeaturingMovie']);
            })

        }

    }, [objectService, currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName]);

    useEffect(() => {

        if(objectService != null) {

            objectService.getAvailableRelatedObjectEntries(scopeKey, relatedObjectEntryAPIPath).then(data => {
                setAvailableRelatedObjectEntries(data.items.map((item) => ({ ...item, active: false})))
            })

        }

    }, [objectService, scopeKey, relatedObjectEntryAPIPath, addItemToggle]);

    const addSelectedItems = (selected) => {
        objectService.addRelatedObjectEntries(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName, selected.map((item) => item.id)).then(() => {
            objectService.getRelatedObjectEntries(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName).then(data => {
                setRelatedObjectEntries(data['actorFeaturingMovie']);
            })
        });
    }

    const removeRelatedEntry = (relatedObjectEntryId) => {
        objectService.removeRelatedObjectEntry(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName, relatedObjectEntryId).then(() => {
            objectService.getRelatedObjectEntries(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName).then(data => {
                setRelatedObjectEntries(data['actorFeaturingMovie']);
            })
        });
    }

    return (
		<ClayIconSpriteContext.Provider value={window.Liferay.Icons.spritemap}>

            <AddItemModal
                addSelectedItems={addSelectedItems}
                availableRelatedObjectEntries={availableRelatedObjectEntries}
                setAvailableRelatedObjectEntries={setAvailableRelatedObjectEntries}
                addItem={null}
                addItemToggle={addItemToggle}
                setAddItemToggle={setAddItemToggle}
            />

            <div className="p-4">
				<Toolbar>
					<Toolbar.Nav>
						<Toolbar.Item className="text-left" expand>
						</Toolbar.Item>

						<Toolbar.Item>
							<Toolbar.Section>
                                <ClayButtonWithIcon
                                    aria-label="Add Item"
                                    symbol="plus"
                                    title="Add Item"
                                    onClick={() => {setAddItemToggle(true)}}
                                />
							</Toolbar.Section>
						</Toolbar.Item>

					</Toolbar.Nav>
				</Toolbar>                
				<List className="mt-4" showQuickActionsOnHover>
                    {relatedObjectEntries.map((entry) => (
                        <List.Item key={entry.id} flex>
                            <List.ItemField expand>
                                <List.ItemTitle>{entry.title}</List.ItemTitle>
                            </List.ItemField>
                            <List.ItemField>
                                <List.QuickActionMenu>
                                    <List.QuickActionMenu.Item
                                        aria-label="Delete"
                                        title="Delete"
                                        onClick={() => removeRelatedEntry(entry.id)}
                                        symbol="trash"
                                    />
                                </List.QuickActionMenu>
                            </List.ItemField>
                        </List.Item>
                    ))}
				</List>
			</div>
        </ClayIconSpriteContext.Provider>        
    );
};

export default ManyToMany;
