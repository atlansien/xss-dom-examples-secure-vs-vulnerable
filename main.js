import './style.css';

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

window.displayUseTrustedTypesError = function () {
  const input = document.getElementById('trustedErrorInput').value;
  const escapeHTMLPolicy = trustedTypes.createPolicy('myErrorPolicy', {
    createHTML: (string) => {
      // XSSの可能性がある文字列パターンをチェック
      const xssPatterns = [
        /<script\b[^>]*>/i,
        /javascript:/i,
        /data:/i,
        /on\w+\s*=/i,
        /style\s*=/i,
      ];

      // XSSパターンが検出された場合はエラーを投げる
      for (const pattern of xssPatterns) {
        if (pattern.test(string)) {
          throw new Error('潜在的なXSSが検出されました: ' + string);
        }
      }

      // 安全な文字列のみを許可
      const div = document.createElement('div');
      div.textContent = string;
      return div.innerHTML;
    },
  });
  try {
    const escaped = escapeHTMLPolicy.createHTML(input);
    console.log('trustedtypesError', escaped);
    document.getElementById('trustedErrorOutput').innerHTML = escaped;
  } catch (e) {
    document.getElementById('trustedErrorOutput').textContent =
      '⚠️ エラー: ' + e.message;
  }
};
