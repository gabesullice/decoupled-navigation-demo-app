import { get } from "jsonpointer";

function testPath(regex) {
  return (response) => response && regex.test(new URL(response.url).pathname);
}

function testStatus(code) {
  return (response) => response && response.statusCode === code;
}

function testJSON({ pointer, value }) {
  return (response, { json }) => {
    return json && get(json, pointer) === value;
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
  return (caseComponent) => {
    return testCase(caseComponent, values);
  };
}

// @todo: validate that all children are Case components.
// @todo: validate that only one child has the "any" attribute.
export default function Switch({
  responseContext: {
    response,
    message: { loading = false, json = null },
  },
  children: caseComponents,
}) {
  const caseTester = getCaseTester(response, { loading, json });
  return caseComponents.find(caseTester) || null;
}
