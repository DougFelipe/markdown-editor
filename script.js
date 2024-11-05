// Seleciona os elementos do DOM
const markdownInput = document.getElementById('markdown-input');
const previewOutput = document.getElementById('preview-output');
const lineNumbersEditor = document.getElementById('line-numbers-editor');
const lineNumbersPreview = document.getElementById('line-numbers-preview');

// Função para converter markdown para HTML
function convertMarkdownToHTML(markdown) {
    return markdown
        .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
        .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/\n$/gim, '')
        .replace(/\n/g, '<br />')
        .replace(/^-{3,}$/gim, '<hr />')
        .trim();
}

// Atualiza a visualização ao vivo e a contagem de linhas
function updatePreview() {
    const markdownText = markdownInput.value;
    previewOutput.innerHTML = convertMarkdownToHTML(markdownText);
    updateLineNumbers(markdownText);
}

// Atualiza a contagem de linhas para o editor e o preview
function updateLineNumbers(text) {
    const lines = text.split('\n').length;
    const lineNumbersHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
    lineNumbersEditor.innerHTML = lineNumbersHTML;
    lineNumbersPreview.innerHTML = lineNumbersHTML;
}

// Evento de input para atualizar preview e contagem de linhas
markdownInput.addEventListener('input', updatePreview);

// Função para aplicar formatação Markdown ao texto selecionado
function applyMarkdown(syntax) {
    const startPos = markdownInput.selectionStart;
    const endPos = markdownInput.selectionEnd;
    const text = markdownInput.value;

    if (syntax.includes('#') || syntax === '> ' || syntax === '---') {
        markdownInput.value = text.slice(0, startPos) + syntax + text.slice(startPos);
    } else if (syntax === '- List item' || syntax === '1. Ordered item') {
        const lineStart = text.lastIndexOf('\n', startPos) + 1;
        markdownInput.value = text.slice(0, lineStart) + syntax + text.slice(startPos);
    } else if (syntax.includes('| Header')) {
        markdownInput.value = text.slice(0, startPos) + syntax + text.slice(startPos);
    } else {
        markdownInput.value = text.slice(0, startPos) + syntax + text.slice(endPos);
    }

    markdownInput.focus();
    updatePreview();
}

// Função para sincronizar a rolagem entre o editor, preview e as colunas de número de linhas
function synchronizeScroll(source) {
    const scrollTop = source.scrollTop;
    
    // Sincroniza as seções de rolagem verticalmente
    markdownInput.scrollTop = scrollTop;
    previewOutput.scrollTop = scrollTop;
    lineNumbersEditor.scrollTop = scrollTop;
    lineNumbersPreview.scrollTop = scrollTop;
}

// Eventos de rolagem para sincronizar o editor, preview e números de linha
markdownInput.addEventListener('scroll', () => synchronizeScroll(markdownInput));
previewOutput.addEventListener('scroll', () => synchronizeScroll(previewOutput));
