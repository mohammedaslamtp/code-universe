// html editor
export const html_editor = (cb) => {
  const targetNode = document.querySelector("#html .CodeMirror-code");
  const config = { attributes: true, childList: true, subtree: true };
  let data = "";
  if (html_CodeMirror) {
    const observer = new MutationObserver((_mutationsList, _observer) => {
      data = html_CodeMirror.getValue();
      cb(data);
    });
    observer.observe(targetNode, config);
  }
};

// update formatted code
export const updateFormatedCode = (language, code) => {
  if (language == "html") {
    html_CodeMirror.setValue(code);
  } else if (language == "css") {
    css_CodeMirror.setValue(code);
  } else if (language == "js") {
    js_CodeMirror.setValue(code);
  }
};

// css editor
export const css_editor = (cb) => {
  // get css code
  const targetNode = document.querySelector("#css .CodeMirror-code");
  const config = { attributes: true, childList: true, subtree: true };
  let data = "";
  const observer = new MutationObserver((mutationsList, observer) => {
    data = css_CodeMirror.getValue();
    cb(data);
  });
  observer.observe(targetNode, config);
};

// js editor
export const js_editor = (cb) => {
  // get js code
  const targetNode = document.querySelector("#js .CodeMirror-code");
  const config = { attributes: true, childList: true, subtree: true };
  let data = "";
  const observer = new MutationObserver((mutationsList, observer) => {
    data = js_CodeMirror.getValue();
    cb(data);
  });
  observer.observe(targetNode, config);
};
