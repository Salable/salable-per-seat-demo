export const SeatActionType = {
    assign: "assign",
    unassign: "unassign",
    replace: "replace"
} as const;

export type SeatActionType = typeof SeatActionType[keyof typeof SeatActionType];

