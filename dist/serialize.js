const urlencode = str => {
  // http://kevin.vanzonneveld.net
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
};

export default (form => {
  if (!form || form.nodeName !== "FORM") {
    return;
  }

  var i,
      j,
      q = [],
      data = {};

  for (i = form.elements.length - 1; i >= 0; i = i - 1) {
    if (form.elements[i].name === "") {
      continue;
    }

    switch (form.elements[i].nodeName) {
      default:
        switch (form.elements[i].type) {
          case 'checkbox':
          case 'radio':
            if (form.elements[i].checked) {
              q.push(urlencode(form.elements[i].name) + "=" + urlencode(form.elements[i].value));
              data[form.elements[i].name] = form.elements[i].value;
            }

            break;

          default:
            q.push(urlencode(form.elements[i].name) + "=" + urlencode(form.elements[i].value));
            data[form.elements[i].name] = form.elements[i].value;
            break;
        }

        break;

      case 'file':
        break;

      case 'TEXTAREA':
        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
        data[form.elements[i].name] = form.elements[i].value;
        break;

      case 'SELECT':
        switch (form.elements[i].type) {
          case 'select-multiple':
            data[form.elements[i].name] = [];

            for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
              if (form.elements[i].options[j].selected) {
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                data[form.elements[i].name].push(form.elements[i].value);
              }
            }

            break;

          default:
            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
            data[form.elements[i].name] = form.elements[i].value;
            break;
        }

        break;

      case 'BUTTON':
        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
        data[form.elements[i].name] = form.elements[i].value;
        break;
    }
  }

  return {
    data: data,
    q: q.join("&")
  };
});