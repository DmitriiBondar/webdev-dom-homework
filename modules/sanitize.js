export function sanitize(text) {
    return text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('QUOTE_BEGIN', '<div class="quote">').replaceAll('QUOTE_END', '</div>');
}