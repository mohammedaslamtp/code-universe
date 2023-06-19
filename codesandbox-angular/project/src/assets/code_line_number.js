// // html editor
// export const html_editor = (id, cb) => {
//   const codeArea = document.getElementById(id);
//   const html_CodeMirror = CodeMirror(document.getElementById(id), {
//     lineNumbers: true,
//     value: `<!-- write your HTML code here.. -->`,
//     theme: "ayu-mirage",
//     mode: "text/html",
//     dragDrop: "drop",
//     matchBrackets: true,
//     autoCloseBrackets: true,
//     autocorrect: true,
//     autocapitalize: true,
//   });


//   // get html code
//   const targetNode = document.querySelector("#html .CodeMirror-code");
//   const config = { attributes: true, childList: true, subtree: true };
//   let data = "";
//   const observer = new MutationObserver((mutationsList, observer) => {
//     data = html_CodeMirror.getValue();
//     cb(data);
//   });
//   observer.observe(targetNode, config);
// };

// // update formatted code
// export function updateFormatedCode(id, code) {
//   const codeArea = document.getElementById(id);
//   const html_CodeMirror = CodeMirror(codeArea, {
//     lineNumbers: true,
//     value: `${code}`,
//     theme: "ayu-mirage",
//     mode: "text/html",
//     dragDrop: "drop",
//     matchBrackets: true,
//     autoCloseBrackets: true,
//     autocorrect: true,
//     autocapitalize: true,
//   });
//   const data = html_CodeMirror.getValue();
//   // console.log("data: ", data);
//   html_CodeMirror.setValue(code);
//   // let codeInstance = document.getElementById(id)
//   // codeInstance.nodeValue = code
// }
// // css editor
// export const css_editor = (id, cb) => {
//   const css_CodeMirror = CodeMirror(document.getElementById(id), {
//     lineNumbers: true,
//     value: `/* write your CSS code here.. */`,
//     theme: "ayu-mirage",
//     mode: "css",
//     matchBrackets: true,
//     autoCloseBrackets: true,
//     autocorrect: true,
//     autocapitalize: true,
//   });

//   // get css code
//   const targetNode = document.querySelector("#css .CodeMirror-code");
//   const config = { attributes: true, childList: true, subtree: true };
//   let data = "";
//   const observer = new MutationObserver((mutationsList, observer) => {
//     data = css_CodeMirror.getValue();
//     cb(data);
//   });
//   observer.observe(targetNode, config);
// };

// // js editor
// export const js_editor = (id, cb) => {
//   const js_CodeMirror = CodeMirror(document.getElementById(id), {
//     lineNumbers: true,
//     value: `//write your JS code here..`,
//     theme: "ayu-mirage",
//     mode: "javascript",
//     autocorrect: true,
//     matchBrackets: true,
//     autoCloseBrackets: true,
//     autocapitalize: true,
//   });

//   // get js code
//   const targetNode = document.querySelector("#js .CodeMirror-code");
//   const config = { attributes: true, childList: true, subtree: true };
//   let data = "";
//   const observer = new MutationObserver((mutationsList, observer) => {
//     data = js_CodeMirror.getValue();
//     cb(data);
//   });
//   observer.observe(targetNode, config);
// };
