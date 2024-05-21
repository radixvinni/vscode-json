"use strict";

import {
  ExtensionContext,
  commands,
  window,
  Position,
  Range,
  TextEditor,
  Selection
} from "vscode";

import JsonHelper from "./json-helper";

export function activate(context: ExtensionContext) {
  let jsonHelper = new JsonHelper();

  /**
   * This function is used to set the current document text
   * @param newText
   */
  let setText = (editor: TextEditor, newText: string) => {
    let doc = editor.document;
    editor.edit(builder => {
      let start, end;

      // Format whole file or selected text
      if (editor.selection.isEmpty) {
        const lastLine = doc.lineAt(doc.lineCount - 1);
        start = new Position(0, 0);
        end = new Position(doc.lineCount - 1, lastLine.text.length);
      } else {
        start = editor.selection.start;
        end = editor.selection.end;
      }

      // replace text
      builder.replace(new Range(start, end), newText);

      // Select the whole json
      editor.selection = new Selection(start, end);
    });
  };

  /**
   * validateJson
   */
  let validateJson = commands.registerCommand("extension.validateJson", () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");

    // Determine whether JSON is valid or invalid
    jsonHelper.isValid(trimmedText)
      ? window.showInformationMessage("Valid JSON")
      : window.showErrorMessage("Invalid JSON");
  });

  /**
   * escapeJson
   */
  let escapeJson = commands.registerCommand("extension.escapeJson", () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");

    // Escape JSON
    let escapedJson = jsonHelper.escape(trimmedText);
    if (escapedJson !== trimmedText) {
      setText(editor, escapedJson);
    }
  });

  /**
   * unescapeJson
   */
  let unescapeJson = commands.registerCommand("extension.unescapeJson", () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");

    // Unescape JSON
    let unescapedJson = jsonHelper.unescape(trimmedText);

    if (unescapedJson !== trimmedText) {
      setText(editor, unescapedJson);
    }
  });

  /**
   * beautifyJson
   */
  let beautifyJson = commands.registerCommand("extension.beautifyJson", () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");

    // Beautify JSON
    let beautifiedJson = jsonHelper.beautify(
      trimmedText,
      // tabs vs spaces
      editor.options.insertSpaces ? editor.options.tabSize : "\t"
    );
    if (beautifiedJson !== trimmedText) {
      // tabs vs spaces
      let tabStyle = editor.options.insertSpaces ? " " : "\t";

      if (!editor.selection.isEmpty) {
        let start = editor.selection.start;
        beautifiedJson = beautifiedJson.replace(
          /(\n)/g,
          "$1" + tabStyle.repeat(start.character)
        );
      }
      setText(editor, beautifiedJson);
    }
  });

  /**
   * beautifyJson
   */
  let beautifyJsonTopLevel = commands.registerCommand("extension.beautifyJsonTopLevel", () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");

    // Beautify JSON
    let beautifiedJson = jsonHelper.beautifyTopLevel(
      trimmedText,
      // tabs vs spaces
      editor.options.insertSpaces ? editor.options.tabSize : "\t"
    );
    if (beautifiedJson !== trimmedText) {
      // tabs vs spaces
      let tabStyle = editor.options.insertSpaces ? " " : "\t";

      if (!editor.selection.isEmpty) {
        let start = editor.selection.start;
        beautifiedJson = beautifiedJson.replace(
          /(\n)/g,
          "$1" + tabStyle.repeat(start.character)
        );
      }
      setText(editor, beautifiedJson);
    }
  });
  
  /**
   * uglifyJson
   */
  let uglifyJson = commands.registerCommand("extension.uglifyJson", () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");

    // Uglify JSON
    let uglifiedJson = jsonHelper.uglify(trimmedText);
    if (uglifiedJson !== trimmedText) {
      setText(editor, uglifiedJson);
    }
  });

  context.subscriptions.push(jsonHelper);
  context.subscriptions.push(validateJson);
  context.subscriptions.push(beautifyJson);
  context.subscriptions.push(beautifyJsonTopLevel);
  context.subscriptions.push(uglifyJson);
  context.subscriptions.push(escapeJson);
  context.subscriptions.push(unescapeJson);
}

/**
 * This method is called when this extension is deactivated
 */
export function deactivate() {}
