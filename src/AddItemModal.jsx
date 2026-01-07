import React, { useState, useEffect, useMemo } from "react";
import Modal, { useModal } from "@clayui/modal";
import Button from "@clayui/button";
import List from "@clayui/list";

const AddItemModal = ({
  addSelectedItems,
  availableRelatedObjectEntries,
  setAvailableRelatedObjectEntries,
  addItemToggle,
  setAddItemToggle,
  addItem,
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
                <List.Item
                    style={{cursor: 'pointer'}}
                    key={item.id}
                    active={item.active}
                    flex
                    onClick={() => setActive(item.id, !item.active)}
                >
                  <List.ItemField expand>
                    <List.ItemTitle>{item.title}</List.ItemTitle>
                  </List.ItemField>
                </List.Item>
              ))}
            </List>
          </Modal.Body>

          <Modal.Footer
            first={
              <Button displayType="secondary" onClick={() => setAddItemToggle(false)}>
                Cancel
              </Button>
            }
            last={
              <Button
                displayType="primary"
                disabled={isAddDisabled}
                onClick={() => {
                  const selected = availableRelatedObjectEntries.filter((e) => e.active);

                  addSelectedItems(selected);

                  setAddItemToggle(false);
                }}
              >
                {addLabel}
              </Button>
            }
          />
        </Modal>
      )}
    </>
  );
};

export default AddItemModal;
