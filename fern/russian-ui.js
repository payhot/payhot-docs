(() => {
  const translations = new Map([
    ["Search", "Поиск"],
    ["Search documentation", "Поиск по документации"],
    ["Ask a question", "Задать вопрос"],
    ["Ask AI", "Спросить ИИ"],
    ["Ask a question about this page", "Задать вопрос об этой странице"],
    ["Copy page", "Копировать страницу"],
    ["View as Markdown", "Открыть в Markdown"],
    ["More actions", "Ещё"],
    ["On this page", "На этой странице"],
    ["Authentication", "Авторизация"],
    ["Light", "Светлая тема"],
    ["Dark", "Тёмная тема"],
    ["System", "Как в системе"],
    ["Server URL", "Адрес сервера"],
    ["Headers", "Заголовки"],
    ["Path Parameters", "Параметры пути"],
    ["Path parameters", "Параметры пути"],
    ["Query Parameters", "Параметры запроса"],
    ["Query parameters", "Параметры запроса"],
    ["Request", "Запрос"],
    ["Request Body", "Тело запроса"],
    ["Response", "Ответ"],
    ["Responses", "Ответы"],
    ["Response Body", "Тело ответа"],
    ["Response headers", "Заголовки ответа"],
    ["Example", "Пример"],
    ["Examples", "Примеры"],
    ["Send", "Отправить"],
    ["Try it", "Попробовать"],
    ["Customize and run in API Explorer", "Настроить и выполнить в API Explorer"],
    ["Opens the API Explorer", "Открывает API Explorer"],
    ["Deprecated", "Устарело"],
    ["Successful", "Успешно"],
    ["Retrieved", "Получено"],
    ["Allowed values", "Допустимые значения"],
    ["Allowed values:", "Допустимые значения:"],
    ["list of objects", "список объектов"],
    ["Errors", "Ошибки"],
    ["Was this page helpful?", "Страница была полезной?"],
    ["Yes", "Да"],
    ["No", "Нет"],
    ["Previous", "Назад"],
    ["Next", "Далее"],
    ["Built with", "Работает на"],
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
    const translated = translations.get(trimmed) ||
      trimmed.replace(/^Show (\d+) properties$/, "Показать свойства: $1")
        .replace(/^Hide (\d+) properties$/, "Скрыть свойства: $1")
        .replace(/^(\d+)-(\d+) characters$/, "$1–$2 символов");
    if (!translated || translated === trimmed) return;

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
    document.documentElement.lang = "ru";
    translateTree(document.body);

    let translationScheduled = false;
    new MutationObserver(() => {
      if (translationScheduled) return;
      translationScheduled = true;
      window.setTimeout(() => {
        translationScheduled = false;
        translateTree(document.body);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  };

  const startAfterHydration = () => {
    window.setTimeout(start, 2000);
  };

  if (document.readyState === "complete") {
    startAfterHydration();
  } else {
    window.addEventListener("load", startAfterHydration, { once: true });
  }
})();
