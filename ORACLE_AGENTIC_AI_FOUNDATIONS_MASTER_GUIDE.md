# Oracle 1Z0-1157-26: Agentic AI Foundations Associate
## 📘 Повний навчальний конспект і практичні матеріали курсу

---

## 🎯 Загальна інформація про сертифікацію
* **Назва іспиту:** 1Z0-1157-26: Agentic AI Foundations Associate
* **Тривалість іспиту:** 60 хвилин
* **Кількість питань:** 40
* **Прохідний бал:** 65% (необхідно правильно відповісти мінімум на 26 питань)
* **Платформа:** Oracle MyLearn / OCI (Oracle Cloud Infrastructure)

---

# 📚 РОЗДІЛ 1: Модулі курсу та ключова теорія

---

### Модуль 1: Introduction to AI Agents (Вступ до AI-агентів)
* **Що таке AI-агент:** Модельна система (model-based system), яка використовує LLM як ядро прийняття рішень, володіє автономністю, використовує інструменти (tools) та оркестрацію циклів (agent loop).
* **Відмінність від традиційних систем:** Не вимагає наперед визначених жорстких маршрутів виконання (static execution paths). Динамічно обирає наступні кроки на основі спостережень.
* **Базові поведінки агента (Agent Loop):**
  1. **Plan** (Планування)
  2. **Use tools / Act** (Використання інструментів)
  3. **Reflect / Observe** (Аналіз результатів)
  4. **Summarize & Terminate / Remember** (Формування відповіді та збереження стану)
* **Патерни міркування (Reasoning Patterns):**
  * **Chain-of-Thought (CoT):** Покрокове міркування. Zero-shot фраза: *"Let's think step by step."*
  * **ReAct (Reasoning + Acting):** Чергування генерації міркувань (Thought), виконання дій через інструменти (Action / Tool Call) та отримання результатів спостережень (Observation).
* **Безпека:** Захист від prompt injection, memory poisoning (отруєння довгострокової пам'яті шкідливими даними) та використання вхідних/вихідних guardrails.

---

### Модуль 2: LangChain for AI Agents
* **Основні абстракції:** Chat Models, Prompts, Tools, Agents, Chains.
* **LangChain Expression Language (LCEL):**
  * Композиція ланцюгів через пайп (`|`), наприклад: `chain = prompt | model | StrOutputParser()`
  * `StrOutputParser()` — витягує чистий текст (рядок) із вихідного об'єкта `AIMessage`.
* **Робота з інструментами (`@tool`):**
  * **Docstrings:** Критично важливі, оскільки саме вони передаються в LLM як опис того, коли і для чого викликати інструмент.
  * **Type hints (типізація Python):** Автоматично генерують JSON-схему параметрів інструмента для моделі.
* **Виклик `agent.invoke()`:**
  * Автоматично бере на себе побудову схем інструментів, парсинг tool calls від LLM, виконання функцій та запуск повторних ітерацій agent loop.

---

### Модуль 3: Model Context Protocol (MCP) Fundamentals
* **Призначення MCP:** Відкритий стандарт (ініційований Anthropic) для вирішення **N × M проблеми конекторів** між AI-додатками та зовнішніми даними/інструментами.
* **Аналогія "USB-C для AI":** Підкреслює, що MCP є стандартизованим універсальним інтерфейсом підключення.
* **Архітектура:**
  * **MCP Host:** Додаток (IDE, агент, чатбот), що ініціює роботу.
  * **MCP Client:** Підтримує виділене 1:1 з'єднання з MCP Server.
  * **MCP Server:** Експонує інструменти, ресурси та промпти.
* **Ключові примітиви MCP:**
  1. **Tools:** Виконувані операції, які викликає LLM (Model-controlled). Метод `tools/list` повертає список інструментів та їхні JSON-схеми вхідних параметрів.
  2. **Resources:** Дані лише для читання під контролем додатку (Application-controlled context), наприклад, файли чи записи БД.
  3. **Prompts:** Перевикористовувані шаблони підказок, які зазвичай обираються користувачем через UI.
* **Протокол та транспорт:**
  * Повідомлення форматуються у **JSON-RPC 2.0**.
  * Фаза ініціалізації: Клієнт і сервер обмінюються версіями протоколу та підтримуваними можливостями (capabilities negotiation).
  * Транспорти: **stdio** (локальний міжпроцесний) та **Streamable HTTP / SSE** (віддалений).

---

### Модуль 4: OpenAI Responses API & Agents SDK
* **OpenAI Responses API:** Ендпоінт інференсу — надсилає вхідні дані в модель і повертає згенерований текст або запити на виклик інструментів (tool call requests).
* **OpenAI Agents SDK Primitives:**
  * **Agent:** Об'єкт агента з інструкціями, доступними моделями та інструментами.
  * **Runner:** Оркестратор, який безпосередньо крутить цикл агента (ReAct agent loop).
  * **@function_tool:** Декоратор, що перетворює стандартну Python-функцію на інструмент, доступний для виклику агентом.
  * **Handoffs:** Механізм передачі контролю діалогу від одного спеціалізованого агента до іншого. Поле `handoff_description` допомагає батьківському агенту визначити, кому делегувати задачу.
  * **Manager Pattern vs Handoffs:** Патерн "Manager (Agent-as-Tool)" обирається, коли потрібна централізована координація та агрегація результатів підзадач, тоді як Handoffs повністю передають керування сесією.
  * **Guardrails:** Допоміжні агенти або валідатори для перевірки входів/виходів та спрацьовування "tripwires" (запобіжників) проти джейлбрейків та некоректного контенту.

---

### Модуль 5: OCI Enterprise AI Platform & Agents
* **Три рівні платформи OCI Enterprise AI:**
  1. **AI Models:** Інференс моделей (On-Demand / Shared для стандартних моделей; Dedicated AI Clusters для ізольованих GPU та fine-tuned/custom моделей).
  2. **AI Agents:** Оркестрація агентів, керований runtime, інструменти, пам'ять.
  3. **AI Governance:** Контроль доступу (OCI IAM, підписані запити, політики), моніторинг, безпека.
* **Ідентифікація та маршрутизація:** Запити до OCI Responses API обов'язково асоціюються з **Project OCID** (Generative AI Project).
* **Сумісність:** OCI Responses API надає **OpenAI-сумісний інтерфейс** (можна використовувати стандартний OpenAI Python SDK, замінивши `base_url` та заголовки авторизації).
* **Вбудовані інструменти OCI Agents:**
  * File Search
  * Code Interpreter
  * Function Calling
  * MCP Calling
* **Пам'ять в OCI AI Agents:**
  * **Short-Term Memory:** Збереження контексту розмови між репліками всередині однієї сесії.
  * **Long-Term Memory:** Довговічна збережена пам'ять фактів і профілю, спільна для багатьох сесій/діалогів.
* **Деплой:** Гостьові агентні додатки упаковуються у стандартні Docker-контейнери та зберігаються в **OCI Container Registry**.

---

### Модуль 6: Agentic AI for Oracle AI Database
* **Головна стратегічна концепція:** *"Bringing AI capabilities natively into the database"* (Перенесення можливостей ШІ безпосередньо всередину БД до даних, а не вивантаження даних назовні).
* **Oracle AI Vector Search:**
  * **VECTOR:** Нативний тип даних у БД (Oracle Database 23ai) для збереження векторних ембедингів.
  * **Ембединг:** Вектор дійсних чисел, згенерований нейромережею для відображення семантичного сенсу.
  * **Генерація векторів:** Підтримується як локально всередині БД через моделі у форматі **ONNX**, так і через виклики зовнішніх REST API (OCI GenAI, OpenAI, Cohere).
  * **Пайплайн підготовки даних:** `UTL_TO_TEXT` → `UTL_TO_CHUNKS` → `UTL_TO_EMBEDDINGS`.
  * **SQL-функції:** `VECTOR_DISTANCE()` — для обчислення відстані/схожості між векторами.
  * **Hybrid Vector Index:** Поєднання векторного (семантичного) та повнотекстового (keyword) пошуку.
  * **Робочий процес RAG:** *Generate embeddings → Store vectors → Create indexes → Search and query → Feed into LLM*.
* **Select AI Agent:**
  * Вбудований агентний фреймворк, що транслює природну мову в SQL і виконує RAG-запити до таблиць бази даних.
* **Autonomous AI Database MCP Server:**
  * Вбудований у БД сервер MCP, що знижує операційні витрати та застосовує корпоративну безпеку (VPD, RBAC) безпосередньо на рівні бази даних.
* **Private Agent Factory:**
  * No-code платформа всередині екосистеми Oracle AI Database для швидкого створення та налаштування агентів.

---

# 📝 РОЗДІЛ 2: Повна база 40 екзаменаційних питань (Practice Exam)

| № | Питання | Правильна відповідь |
|---|---------|---------------------|
| **1** | Which prompt addition is used for zero-shot Chain-of-Thought prompting? | **"Let's think step by step."** |
| **2** | Which three layers make up the OCI Enterprise AI Platform? | **AI Models, AI Agents, and AI Governance** |
| **3** | How do On-Demand serving and Dedicated AI Clusters differ for OCI Enterprise AI Models? | **On-Demand uses shared infrastructure while Dedicated AI Clusters provide isolated GPUs required for custom models.** |
| **4** | Which value associates OCI Responses API requests with a specific OCI Generative AI Project? | **Project OCID** |
| **5** | How is authentication handled securely for OCI Enterprise AI APIs? | **OCI IAM authentication with signed requests and IAM policies** |
| **6** | Why are docstrings especially important when defining LangChain tools with the @tool decorator? | **They tell the LLM when and how to use the tool.** |
| **7** | What is the purpose of the `handoff_description` field on a specialist agent when using OpenAI Agents SDK? | **It helps the parent agent decide when to delegate to the specialist.** |
| **8** | Which four behaviors does every Select AI Agent perform? | **Plan, Use tools, Summarize, and Terminate** |
| **9** | Which behavior is NOT a characteristic of modern LLM-based AI agents? | **Requiring every execution path to be predefined** |
| **10** | Which statement describes an LLM-based AI agent? | **A model-based system that uses tools and orchestration.** |
| **11** | Which tasks is handled automatically by LangChain when using `agent.invoke()`? | **Building tool schemas, parsing tool calls, and orchestrating execution loops.** |
| **12** | How are tool calls handled between the LLM and the application? | **It generates a tool-call request for the application to validate and run.** |
| **13** | What occurs during the MCP initialization phase? | **The client and server exchange protocol versions and supported capabilities.** |
| **14** | Which approaches are supported by OCI Enterprise AI Agents? | **Call the Responses API directly or deploy a hosted agent application** |
| **15** | Which native column type does Oracle AI Database use for storing vector embeddings? | **VECTOR** |
| **16** | What is an embedding in a semantic search workflow? | **A vector produced by a neural network.** |
| **17** | What integration problem does MCP address? | **N × M custom-connector problem between AI apps and tools** |
| **18** | In the context of MCP, what does the USB-C for AI analogy emphasize? | **MCP is a standardized interface.** |
| **19** | Which message format does MCP use for client-server communication? | **JSON-RPC 2.0** |
| **20** | What does the MCP `tools/list` method return? | **All tools the server offers and their input schemas.** |
| **21** | Which OCI capability is required for serving fine-tuned or imported custom models? | **Dedicated AI Clusters** |
| **22** | What does the `@function_tool` decorator do in the OpenAI Agents SDK? | **Converts a regular Python function into a tool the agent can call.** |
| **23** | In OpenAI Agents SDK, how does the model select which tool to call? | **It uses tool names, descriptions, and schemas.** |
| **24** | Which MCP primitive is application-controlled and provides read-only context data to the model? | **Resources** |
| **25** | According to the MCP architecture model, which statement describes the client-server relationship? | **An MCP client maintains a dedicated connection to an MCP server.** |
| **26** | What is the architectural advantage of Autonomous AI Database MCP Server over a separately deployed third-party MCP server? | **It reduces operational overhead and enforces security inside the database.** |
| **27** | In the OpenAI Agents SDK, what is the role of the Runner? | **It executes the agent loop.** |
| **28** | What is the strategic theme behind agentic AI capabilities in Oracle AI Database? | **Bringing AI capabilities natively into the database** |
| **29** | What is the high-level workflow for Oracle AI Vector Search? | **Generate embeddings → Store vectors → Create indexes → Search and query → Feed into LLM** |
| **30** | Which approaches can generate embeddings for Oracle AI Vector Search workflows? | **Use ONNX models in-database or external REST-based embedding providers** |
| **31** | Which statement describes the purpose of the OpenAI Responses API? | **It sends input to an OpenAI model and returns generated output.** |
| **32** | What is the purpose of the Vector Stores API? | **Indexing and retrieving data by meaning.** |
| **33** | Which set lists built-in tool categories supported by OCI Enterprise AI Agents? | **File Search, Code Interpreter, Function Calling, and MCP Calling.** |
| **34** | Which statement describes the OCI Responses API? | **It provides an OpenAI-compatible API** |
| **35** | What is long-term memory in OCI Enterprise AI Agents? | **Durable memory shared across conversations.** |
| **36** | Which description defines memory poisoning in AI-agent systems? | **Malicious content inserted into persistent memory stores.** |
| **37** | Which statement describes use cases for input guardrails in the OpenAI Agents SDK? | **Validating input, detecting unsafe content, and blocking prompt-injection attempts.** |
| **38** | In the given LangChain chain, what is the role of `StrOutputParser()`? | **It extracts plain text from the model response.** |
| **39** | What is Oracle AI Database Private Agent Factory? | **A no-code platform for building agents** |
| **40** | Which SQL function computes distance between vectors in Oracle AI Vector Search? | **VECTOR_DISTANCE()** |

---

# 🔗 Корисні посилання
* **Офіційний курс та іспит:** [Become an OCI Agentic AI Foundations Associate (1Z0-1157-26)](https://mylearn.oracle.com/ou/learning-path/become-an-oci-agentic-ai-foundations-associate/163239)
