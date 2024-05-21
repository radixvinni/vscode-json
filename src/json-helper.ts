let JSON = require("json-bigint");
export default class {
  /**
   * isValid
   * @param text
   */
  public isValid (text: string): boolean {
    try {
      return typeof JSON.parse(text) === "object";
    } catch (err) {
      return false;
    }
  }

  /**
   * escape
   * @param text
   */
  public escape (text: string): string {
    return this.isValid(text)
      ? JSON.stringify(text)
        .replace(/^"/g, "")
        .replace(/"$/g, "")
      : text;
  }

  /**
   * unescape
   * @param text
   */
  public unescape (text: string): string {
    let formattedText = text;
    try {
      if (!text.startsWith('"')) {
        formattedText = '"'.concat(formattedText);
      }

      if (!text.endsWith('"')) {
        formattedText = formattedText.concat('"');
      }

      return JSON.parse(formattedText);
    } catch (err) {
      return text;
    }
  }

  /**
   * beautify
   * @param text
   * @param tabSize
   */
  public beautify (text: string, tabSize?: number | string): string {
    return this.isValid(text)
      ? JSON.stringify(JSON.parse(text), null, tabSize)
      : text;
  }

  /**
   * beautifyTopLevel
   * @param text
   * @param tabSize
   */
  public beautifyTopLevel (text: string, tabSize?: number | string): string {
    return this.isValid(text)
      ? "{\n" + Object.entries(JSON.parse(text)).map(([key, value]) => '"' + key + '": ' + JSON.stringify(value)).join(',\n') + "\n}"
      : text;
  }

  /**
   * uglify
   * @param text
   */
  public uglify (text: string): string {
    return this.isValid(text)
      ? JSON.stringify(JSON.parse(text), null, 0)
      : text;
  }

  /**
   * dispose
   */
  dispose () { }
}
