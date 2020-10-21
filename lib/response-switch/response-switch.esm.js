// @todo: validate the match function as best as possible.
function Case({
  path,
  status,
  json,
  children
}) {
  // @todo: validate that children is a single DOM node, not an array of nodes.
  return children;
}

var hasExcape = /~/;
var escapeMatcher = /~[01]/g;
function escapeReplacer (m) {
  switch (m) {
    case '~1': return '/'
    case '~0': return '~'
  }
  throw new Error('Invalid tilde escape: ' + m)
}

function untilde (str) {
  if (!hasExcape.test(str)) return str
  return str.replace(escapeMatcher, escapeReplacer)
}

function compilePointer (pointer) {
  if (typeof pointer === 'string') {
    pointer = pointer.split('/');
    if (pointer[0] === '') return pointer
    throw new Error('Invalid JSON pointer.')
  } else if (Array.isArray(pointer)) {
    return pointer
  }

  throw new Error('Invalid JSON pointer.')
}

function get (obj, pointer) {
  if (typeof obj !== 'object') throw new Error('Invalid input object.')
  pointer = compilePointer(pointer);
  var len = pointer.length;
  if (len === 1) return obj

  for (var p = 1; p < len;) {
    obj = obj[untilde(pointer[p++])];
    if (len === p) return obj
    if (typeof obj !== 'object') return undefined
  }
}

var get_1 = get;

function testPath(regex) {
  return response => response && regex.test(new URL(response.url).pathname);
}

function testJSON({
  pointer,
  value
}) {
  return (response, {
    json
  }) => {
    return json && get_1(json, pointer) === value;
  };
}

function testCase(caseComponent, values) {
  if (caseComponent.props.any) {
    return true;
  } else if (caseComponent.props.path) {
    return testPath(caseComponent.props.path)(...values);
  } else if (caseComponent.props.status) {
    return testPath(caseComponent.props.status)(...values);
  } else if (caseComponent.props.json) {
    return testJSON(caseComponent.props.json)(...values);
  } else {
    return false;
  }
}

function getCaseTester(...values) {
  return caseComponent => {
    return testCase(caseComponent, values);
  };
} // @todo: validate that all children are Case components.
// @todo: validate that only one child has the "any" attribute.


function Switch({
  responseContext: {
    response,
    message: {
      loading = false,
      json = null
    }
  },
  children: caseComponents
}) {
  const caseTester = getCaseTester(response, {
    loading,
    json
  });
  return caseComponents.find(caseTester) || null;
}

export { Case as ResponseCase, Switch as ResponseSwitch };
