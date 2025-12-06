export const setJsonLd = (id, data) => {
  if (typeof document === "undefined") return;

  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

export const removeJsonLd = (id) => {
  if (typeof document === "undefined") return;

  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
};
