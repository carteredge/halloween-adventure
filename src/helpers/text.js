export function toLabel(text) {
    text = text.replace(/([a-z])([A-Z])/g, "$1 $2");
    return `${text.substring(0,1).toUpperCase()}${text.substring(1)}`;
}