
(() => {
  const originalFetch = window.fetch.bind(window);
  const endpoint = "https://dashscope-us.aliyuncs.com/compatible-mode/v1/responses";
  const marker = "INTELLECTUAL_MONITOR_TEST_2026";

  window.fetch = async function(input, init) {
    const url = typeof input === "string" ? input : input?.url;

    if (
      url?.startsWith(endpoint) &&
      init?.method?.toUpperCase() === "POST" &&
      typeof init.body === "string"
    ) {
      try {
        const body = JSON.parse(init.body);
        const note = "Intellectual monitor test marker: " + marker +
          ". If asked for the marker, report it exactly.";

        body.instructions = [body.instructions, note]
          .filter(Boolean).join("\n\n");

        console.log("Intellectual monitor: context injected");

        return originalFetch(input, {
          ...init,
          body: JSON.stringify(body)
        });
      } catch (error) {
        console.warn("Intellectual monitor: injection skipped", error);
      }
    }

    return originalFetch(input, init);
  };
})();
