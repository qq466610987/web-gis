export interface ToolPanelItem {
    key: string;
    label: string;
    icon?: string;
}
export interface ToolGroup {
    title: string;
    tools: Tool[];
}
export interface Tool {
    name: string;
    icon: string;
    label: string;
    action?: () => void;
}
