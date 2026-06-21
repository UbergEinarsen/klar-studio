import { useState } from "react";

export function validate(v: { name: string; email: string; message: string }) {
  const errors: Record<string, string> = {};
  if (!v.name.trim()) errors.name = "Fyll inn navn.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) errors.email = "Fyll inn en gyldig e-post.";
  if (v.message.trim().length < 5) errors.message = "Skriv en kort melding.";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: import.meta.env.PUBLIC_WEB3FORMS_KEY, ...values }),
      });
      setState((await res.json()).success ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") return <p role="status" className="form__ok">Takk! Vi tar kontakt snart.</p>;

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {(["name", "email", "message"] as const).map((f) => (
        <label key={f} className="form__field">
          <span>{f === "name" ? "Navn" : f === "email" ? "E-post" : "Melding"}</span>
          {f === "message" ? (
            <textarea rows={4} value={values[f]} onChange={(e) => setValues({ ...values, [f]: e.target.value })} />
          ) : (
            <input type={f === "email" ? "email" : "text"} value={values[f]} onChange={(e) => setValues({ ...values, [f]: e.target.value })} />
          )}
          {errors[f] && <em className="form__err">{errors[f]}</em>}
        </label>
      ))}
      <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sender…" : "Send"}</button>
      {state === "error" && <p className="form__err">Noe gikk galt. Prøv igjen eller send e-post.</p>}
    </form>
  );
}
