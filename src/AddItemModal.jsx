import React, { useState, useEffect, useMemo } from "react";
import Modal, { useModal } from "@clayui/modal";
import ClayButton from "@clayui/button";
import List from "@clayui/list";
import PaginationBar from '@clayui/pagination-bar';
import {ClayPaginationWithBasicItems} from '@clayui/pagination';
import Icon from "@clayui/icon";

const AddItemModal = ({
  addSelectedItems,
  availableRelatedObjectEntries,
  setAvailableRelatedObjectEntries,
  addItemToggle,
  setAddItemToggle,
  addItem,
  availableItemsCurrentPage,
  setAvailableItemsCurrentPage,
  availableItemsLastPage,
  availableItemsPageSize,
  setAvailableItemsPageSize,
  totalAvailableItemsAmount
}) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const { observer, onOpenChange, open } = useModal({
    onClose: () => setAddItemToggle(false),
  });

  useEffect(() => {
    if (addItemToggle && !open) onOpenChange(true);
    else if (!addItemToggle && open) onOpenChange(false);
  }, [addItemToggle, open, onOpenChange]);

  const activeCount = useMemo(
    () => availableRelatedObjectEntries.filter((e) => e.active).length,
    [availableRelatedObjectEntries]
  );

  const addLabel = activeCount <= 1 ? "Add Item" : `Add Items (${activeCount})`;
  const isAddDisabled = activeCount === 0;

  const setActive = (id, active) => {
    setAvailableRelatedObjectEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, active } : entry))
    );
  };

  return (
    <>
      {open && (
        <Modal observer={observer}>
          <Modal.Header>Add a new Item</Modal.Header>

          <Modal.Body>
            <List className="mt-4" showQuickActionsOnHover={false}>
              {availableRelatedObjectEntries.map((item) => (
                item.alreadyRelated ? (
                    <List.Item
                        disabled={true}
                        key={item.id}
                        flex
                    >
                        <List.ItemField expand>
                            <List.ItemTitle className="text-weight-normal"><em>{item.title}</em></List.ItemTitle>
                            <List.ItemText className="text-weight-light"><em>Already selected</em></List.ItemText>
                        </List.ItemField>
                    </List.Item>
                ) : (
                    <List.Item
                        style={{cursor: 'pointer'}}
                        key={item.id}
                        active={item.active}
                        flex
                        onClick={() => setActive(item.id, true)}
                    >
                        <List.ItemField expand>
                            <List.ItemTitle>{item.title}</List.ItemTitle>
                        </List.ItemField>
                    </List.Item>
                )
              ))}
            </List>
            <PaginationBar>
                <PaginationBar.DropDown
                items={[5, 10, 20, 50].map((n) => ({
                    label: String(n),
                    onClick: () => setAvailableItemsPageSize(n),
                }))}
                trigger={
                    <ClayButton displayType="unstyled">
                        {availableItemsPageSize} items per page <Icon symbol="caret-double-l" />
                    </ClayButton>
                }
                />

                <PaginationBar.Results>Listing {totalAvailableItemsAmount} Items</PaginationBar.Results>

                <ClayPaginationWithBasicItems
                    active={availableItemsCurrentPage}
                    onActiveChange={(page) => {setAvailableItemsCurrentPage(page)}}
                    ellipsisProps={{ "aria-label": "More", title: "More" }}
                    totalPages={availableItemsLastPage}
                />
            </PaginationBar>  
          </Modal.Body>

          <Modal.Footer
            first={
              <ClayButton displayType="secondary" onClick={() => setAddItemToggle(false)}>
                Cancel
              </ClayButton>
            }
            last={
              <ClayButton
                displayType="primary"
                disabled={isAddDisabled}
                onClick={() => {
                  const selected = availableRelatedObjectEntries.filter((e) => e.active);

                  addSelectedItems(selected);

                  setAddItemToggle(false);
                }}
              >
                {addLabel}
              </ClayButton>
            }
          />
        </Modal>
      )}
    </>
  );
};

export default AddItemModal;
