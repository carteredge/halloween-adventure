import * as showdown from "showdown";

export function convertMD(markdown) {
    const converter = new showdown.Converter();
    return converter.makeHtml(markdown);
}
