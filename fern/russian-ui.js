(() => {
  document.documentElement.lang = "ru";

  const translations = new Map([
    ["Search", "Поиск"],
    ["Search documentation", "Поиск по документации"],
    ["Ask a question", "Задать вопрос"],
    ["Copy page", "Копировать страницу"],
    ["View as Markdown", "Открыть в Markdown"],
    ["More actions", "Ещё"],
    ["On this page", "На этой странице"],
    ["Light", "Светлая тема"],
    ["Dark", "Тёмная тема"],
    ["System", "Как в системе"],
    ["Server URL", "Адрес сервера"],
    ["Headers", "Заголовки"],
    ["Path Parameters", "Параметры пути"],
    ["Query Parameters", "Параметры запроса"],
    ["Request", "Запрос"],
    ["Request Body", "Тело запроса"],
    ["Response", "Ответ"],
    ["Responses", "Ответы"],
    ["Response Body", "Тело ответа"],
    ["Example", "Пример"],
    ["Examples", "Примеры"],
    ["Send", "Отправить"],
    ["Required", "Обязательно"],
    ["Optional", "Необязательно"],
    ["This endpoint expects an object.", "Передайте объект JSON."],
    ["Bad Request Error", "Некорректный запрос"],
    ["Unauthorized Error", "Требуется авторизация"],
    ["Forbidden Error", "Доступ запрещён"],
    ["Not Found Error", "Объект не найден"],
    ["Conflict Error", "Конфликт операции"],
    ["Unsupported Media Type Error", "Неподдерживаемый формат данных"],
    ["Unprocessable Entity Error", "Ошибка проверки данных"],
    ["Too Many Requests Error", "Слишком много запросов"],
    ["Service Unavailable Error", "Сервис временно недоступен"],
    [
      "For AI agents: a documentation index is available at the root level at /llms.txt. Append /llms.txt to any URL for a page-level index, or .md for the markdown version of any page.",
      "Для ИИ-агентов: индекс документации доступен по адресу /llms.txt. Добавьте /llms.txt к адресу раздела или .md к адресу страницы, чтобы получить машиночитаемую версию."
    ]
  ]);

  const ignoredSelector = [
    "script",
    "style",
    "pre",
    "code",
    ".fern-code-block",
    ".fern-code-group",
    ".fern-api-property-key"
  ].join(",");

  const translateTextNode = (node) => {
    const parent = node.parentElement;
    if (!parent || parent.closest(ignoredSelector)) return;

    const source = node.nodeValue;
    const trimmed = source.trim();
    const translated = translations.get(trimmed);
    if (!translated) return;

    node.nodeValue = source.replace(trimmed, translated);
  };

  const translateAttributes = (element) => {
    for (const attribute of ["aria-label", "placeholder", "title"]) {
      const source = element.getAttribute(attribute);
      const translated = source && translations.get(source.trim());
      if (translated) element.setAttribute(attribute, translated);
    }
  };

  const translateTree = (root) => {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (!(root instanceof Element) && root !== document) return;

    if (root instanceof Element) translateAttributes(root);
    root.querySelectorAll?.("[aria-label], [placeholder], [title]").forEach(translateAttributes);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
  };

  const start = () => {
    translateTree(document.body);

    new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") translateTextNode(record.target);
        record.addedNodes.forEach(translateTree);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
