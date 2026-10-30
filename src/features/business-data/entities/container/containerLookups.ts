export const POSITION_UNIT_TYPES = ["Material", "Container", "Resource"];

export const CAPACITY_VALIDATION_MODES = ["None", "Form", "Units"];

export const ORIENTATIONS = [
  "None",
  "Bottom To Top",
  "Top To Bottom",
  "Left To Right",
  "Right To Left",
];

export const POSITION_SORTINGS = ["Ascending", "Descending"];

export const SYSTEM_STATES = ["Available", "Unavailable", "In Transit"];

export const CONTAINER_OPERATIONS = [
  "add-container",
  "dock",
  "empty",
  "make-available",
  "make-unavailable",
  "manage-positions",
  "remove-container",
  "retrieve",
  "store",
  "transfer-container",
  "transfer-material",
  "undock",
] as const;

export type ContainerOperationKey = (typeof CONTAINER_OPERATIONS)[number];

export const OP_ADD_CONTAINER: ContainerOperationKey = "add-container";
export const OP_DOCK: ContainerOperationKey = "dock";
export const OP_EMPTY: ContainerOperationKey = "empty";
export const OP_MAKE_AVAILABLE: ContainerOperationKey = "make-available";
export const OP_MAKE_UNAVAILABLE: ContainerOperationKey = "make-unavailable";
export const OP_MANAGE_POSITIONS: ContainerOperationKey = "manage-positions";
export const OP_REMOVE_CONTAINER: ContainerOperationKey = "remove-container";
export const OP_RETRIEVE: ContainerOperationKey = "retrieve";
export const OP_STORE: ContainerOperationKey = "store";
export const OP_TRANSFER_CONTAINER: ContainerOperationKey = "transfer-container";
export const OP_TRANSFER_MATERIAL: ContainerOperationKey = "transfer-material";
export const OP_UNDOCK: ContainerOperationKey = "undock";
