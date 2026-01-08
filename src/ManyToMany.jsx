import React, { useState, useMemo, useEffect, useCallback } from "react";
import Icon, { ClayIconSpriteContext } from "@clayui/icon";
import List from '@clayui/list';

import Toolbar from '@clayui/toolbar';
import {ClayInput} from '@clayui/form';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayButton, {ClayButtonWithIcon} from '@clayui/button';

import PaginationBar from '@clayui/pagination-bar';
import {ClayPaginationWithBasicItems} from '@clayui/pagination';

import '@clayui/css/lib/css/atlas.css';
import ObjectService from "./services/ObjectService";
import AddItemModal from "./AddItemModal";

const ManyToMany = ({ baseURL, currentObjectEntryId, currentObjectEntryERC, currentObjectEntryAPIPath, relatedObjectEntryAPIPath, objectRelationshipName }) => {

    const [ objectService, setObjectService ] = useState(null);
    const [ addItemToggle, setAddItemToggle ] = useState(false);
    
    const [ availableRelatedObjectEntries, setAvailableRelatedObjectEntries ] = useState([]);
    const [ relatedObjectEntries, setRelatedObjectEntries ] = useState([]);

    const [ scopeKey, setScopeKey ] = useState(null);

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ lastPage, setLastPage ] = useState(1);
    const [ pageSize, setPageSize ] = useState(5);

    const [ totalItemsAmount, setTotalItemsAmount ] = useState(0);

    const [ availableItemsCurrentPage, setAvailableItemsCurrentPage ] = useState(1);
    const [ availableItemsLastPage, setAvailableItemsLastPage ] = useState(1);
    const [ availableItemsPageSize, setAvailableItemsPageSize ] = useState(5);

    const [ totalAvailableItemsAmount, setTotalAvailableItemsAmount ] = useState(0);

    useEffect(() => {

        setObjectService(new ObjectService(baseURL));

    }, [baseURL]);

    useEffect(() => {

        if(objectService != null) {

            objectService.getRelatedObjectEntries(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName, currentPage, pageSize).then(data => {
                setRelatedObjectEntries(data.items);
                setTotalItemsAmount(data.totalCount);
                setLastPage(data.lastPage);
            });

            objectService.getObjectEntryScopeKey(currentObjectEntryId, currentObjectEntryAPIPath).then(data => {
                setScopeKey(data);
            });

        }

    }, [objectService, currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName, currentPage, pageSize]);

    useEffect(() => {

        if(objectService != null && scopeKey != null) {

            objectService.getAvailableRelatedObjectEntries(scopeKey, relatedObjectEntryAPIPath, availableItemsCurrentPage, availableItemsPageSize).then(data => {
                const relatedIds = new Set(relatedObjectEntries.map((e) => e.id));
                setAvailableRelatedObjectEntries(data.items.map((item) => ({ ...item, active: false, alreadyRelated: relatedIds.has(item.id)})))
                setTotalAvailableItemsAmount(data.totalCount);
                setAvailableItemsLastPage(data.lastPage);
            })

        }

    }, [objectService, scopeKey, relatedObjectEntryAPIPath, addItemToggle, availableItemsCurrentPage, availableItemsPageSize]);

    const addSelectedItems = (selected) => {
        objectService.addRelatedObjectEntries(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName, selected.map((item) => item.id)).then(() => {
            objectService.getRelatedObjectEntries(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName, currentPage, pageSize).then(data => {
                setRelatedObjectEntries(data.items);
                setTotalItemsAmount(data.totalCount);
                setLastPage(data.lastPage);
            })
        });
    }

    const removeRelatedEntry = (relatedObjectEntryId) => {
        objectService.removeRelatedObjectEntry(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName, relatedObjectEntryId).then(() => {
            objectService.getRelatedObjectEntries(currentObjectEntryId, currentObjectEntryAPIPath, objectRelationshipName, currentPage, pageSize).then(data => {
                setRelatedObjectEntries(data.items);
                setTotalItemsAmount(data.totalCount);
                setLastPage(data.lastPage);
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
                availableItemsCurrentPage={availableItemsCurrentPage}
                setAvailableItemsCurrentPage={setAvailableItemsCurrentPage}
                availableItemsLastPage={availableItemsLastPage}
                availableItemsPageSize={availableItemsPageSize}
                setAvailableItemsPageSize={setAvailableItemsPageSize}
                totalAvailableItemsAmount={totalAvailableItemsAmount}
            />

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
                                    aria-label="Edit"
                                    title="Edit"
                                    href={`/c/cms/edit_content_item?objectEntryId=${entry.id}&redirect=${document.location.pathname + document.location.search}`}
                                    symbol="pencil"
                                />                                                          
                                <List.QuickActionMenu.Item
                                    aria-label="Delete"
                                    title="Delete"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        removeRelatedEntry(entry.id);
                                    }}
                                    symbol="trash"
                                />
                            </List.QuickActionMenu>
                        </List.ItemField>
                    </List.Item>
                ))}
            </List>
            <PaginationBar>
                <PaginationBar.DropDown
                items={[5, 10, 20, 50].map((n) => ({
                    label: String(n),
                    onClick: () => setPageSize(n),
                }))}
                trigger={
                    <ClayButton displayType="unstyled">
                        {pageSize} items per page <Icon symbol="caret-double-l" />
                    </ClayButton>
                }
                />

                <PaginationBar.Results>Listing {totalItemsAmount} Items</PaginationBar.Results>

                <ClayPaginationWithBasicItems
                    active={currentPage}
                    onActiveChange={(page) => {setCurrentPage(page)}}
                    ellipsisProps={{ "aria-label": "More", title: "More" }}
                    totalPages={lastPage}
                />
            </PaginationBar>           
        </ClayIconSpriteContext.Provider>        
    );
};

export default ManyToMany;
