document.getElementById('generateBtn').addEventListener('click', function () {
    const umlInput = document.getElementById('umlInput').value;
    const classList = extractClasses(umlInput);

    const classListElement = document.getElementById('classList');
    classListElement.innerHTML = '';

    classList.forEach(javaClass => {
        const listItem = document.createElement('li');
        const preElement = document.createElement('pre');
        preElement.textContent = javaClass;
        listItem.appendChild(preElement);
        classListElement.appendChild(listItem);
    });
});

function extractClasses(umlText) {
    const classPattern = /class\s+([a-zA-Z0-9_]+)(\s+extends\s+([a-zA-Z0-9_]+))?\s*{/g;
    const attributePattern = /\+([a-zA-Z0-9_<>]+)\s+([a-zA-Z0-9_]+);/g;
    const methodPattern = /\+([a-zA-Z0-9_<>]+)\s+([a-zA-Z0-9_]+)\((.*?)\);/g;
    const abstractClassPattern = /abstract\s+class\s+([a-zA-Z0-9_]+)\s*{/g;

    let match;
    let classes = [];

    while ((match = classPattern.exec(umlText)) || (match = abstractClassPattern.exec(umlText))) {
        const className = match[1];
        const parentClass = match[3] || null;

        let attributes = [];
        let methods = [];

        const classBody = umlText.slice(umlText.indexOf(match[0]) + match[0].length, umlText.indexOf('}', umlText.indexOf(match[0])));

        let attrMatch;
        while ((attrMatch = attributePattern.exec(classBody)) !== null) {
            attributes.push({ type: attrMatch[1], name: attrMatch[2] });
        }

        let methodMatch;
        while ((methodMatch = methodPattern.exec(classBody)) !== null) {
            methods.push({ returnType: methodMatch[1], name: methodMatch[2], params: parseParameters(methodMatch[3]) });
        }

        classes.push(generateJavaClass(className, parentClass, attributes, methods));
    }

    return classes;
}

function parseParameters(paramString) {
    if (!paramString.trim()) return [];
    return paramString.split(',').map(param => {
        const [type, name] = param.trim().split(/\s+/);
        return { type, name };
    });
}

function generateJavaClass(className, parentClass, attributes, methods) {
    const inheritance = parentClass ? ` extends ${parentClass}` : '';
    let javaClass = `public class ${className}${inheritance} {\n`;

    // Generar atributos
    attributes.forEach(attr => {
        javaClass += `    private ${attr.type} ${attr.name};\n`;
    });

    javaClass += '\n';

    // Generar constructor
    javaClass += `    public ${className}(${attributes.map(attr => `${attr.type} ${attr.name}`).join(', ')}) {\n`;
    attributes.forEach(attr => {
        javaClass += `        this.${attr.name} = ${attr.name};\n`;
    });
    javaClass += `    }\n\n`;

    // Generar métodos
    methods.forEach(method => {
        const params = method.params.map(param => `${param.type} ${param.name}`).join(', ');
        javaClass += `    public ${method.returnType} ${method.name}(${params}) {\n`;
        javaClass += `        // TODO: Implement this method\n`;
        javaClass += `    }\n\n`;
    });

    javaClass += `}\n`;
    return javaClass;
}
