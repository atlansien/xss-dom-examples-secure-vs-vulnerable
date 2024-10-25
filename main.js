import './style.css';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.js';

window.displayUnsafe = function () {
  const input = document.getElementById('unsafeInput').value;
  // 要素をそのまま渡すことで、XSS画面に移動します
  console.log('安全でない', input);
  document.getElementById('unsafeOutput').innerHTML = input;
};

window.displayReplaced = function () {
  const input = document.getElementById('replaceInput').value;
  const replaced = input.replace(
    /[&<>""']/g,
    (match) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[match])
  );
  console.log('replaced: ', replaced);
  document.getElementById('replaceOutput').innerHTML = replaced;
};

window.displayUseTrustedTypes = function () {
  const input = document.getElementById('trustedInput').value;
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: (string) =>
      string
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;'),
  });
  const escaped = escapeHTMLPolicy.createHTML(input);
  console.log('trustedtypes', escaped);
  document.getElementById('trustedOutput').innerHTML = escaped;
};
