// html editor
export const html_editor = (id, cb) => {
  const html_CodeMirror = CodeMirror(document.getElementById(id), {
    lineNumbers: true,
    value: `<!-- write your HTML code here.. -->`,
    theme: "ayu-mirage",
    mode: "text/html",
    autocorrect: true,
    autocapitalize: true,
  });

  // get html code
  const targetNode = document.querySelector("#html .CodeMirror-code");
  const config = { attributes: true, childList: true, subtree: true };
  let data = "";
  const observer = new MutationObserver((mutationsList, observer) => {
    let res = document.getElementById("result");
    data = html_CodeMirror.getValue();
    cb(data);
  });
  observer.observe(targetNode, config);
};

// css editor
export const css_editor = (id, cb) => {
  const css_CodeMirror = CodeMirror(document.getElementById(id), {
    lineNumbers: true,
    value: `/* write your CSS code here.. */`,
    theme: "ayu-mirage",
    mode: "css",
    autocorrect: true,
    autocapitalize: true,
  });

  // get css code
  const targetNode = document.querySelector("#css .CodeMirror-code");
  const config = { attributes: true, childList: true, subtree: true };
  let data = "";
  const observer = new MutationObserver((mutationsList, observer) => {
    let res = document.getElementById("#result");
    data = css_CodeMirror.getValue();
    cb(data);
  });
  observer.observe(targetNode, config);
};

// js editor
export const js_editor = (id,cb) => {
  const js_CodeMirror = CodeMirror(document.getElementById(id), {
    lineNumbers: true,
    value: `//write your JS code here..`,
    theme: "ayu-mirage",
    mode: "javascript",
    autocorrect: true,
    autocapitalize: true,
  });

  // get js code
  const targetNode = document.querySelector("#js .CodeMirror-code");
  const config = { attributes: true, childList: true, subtree: true };
  let data = "";
  const observer = new MutationObserver((mutationsList, observer) => {
    let res = document.getElementById("#result");
    data = js_CodeMirror.getValue();
    cb(data)
  });
  observer.observe(targetNode, config);
};
