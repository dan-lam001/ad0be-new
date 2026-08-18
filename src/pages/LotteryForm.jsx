import { useState, useRef, useCallback, useEffect } from "react";
import { CheckCircle, X, Truck } from "lucide-react";

const DRAWS = [
  { id: "weekly",    name: "Weekly Draw",       date: "Sat 19 Aug 2026", prize: "Truck + $5,000" },
  { id: "midweek",   name: "Midweek Draw",      date: "Wed 23 Aug 2026", prize: "Truck + $500,000" },
  { id: "superball", name: "SuperBall Jackpot", date: "Fri 25 Aug 2026", prize: "Truck + $100,000,000" },
];

const TOTAL_NUMS = 45;
const PICK_COUNT = 6;
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY"
];

const WINNERS = [
  { id: 1, name: "Sarah Mitchell", prize: "Truck + $2,000,000", image: "https://picsum.photos/seed/win1/400/200" },
  { id: 2, name: "James Rodriguez", prize: "Truck + $1,500,000", image: "https://picsum.photos/seed/win2/400/200" },
  { id: 3, name: "Emily Chen", prize: "Truck + $3,200,000", image: "https://picsum.photos/seed/win3/400/200" },
  { id: 4, name: "Michael O'Brien", prize: "Truck + $850,000", image: "https://picsum.photos/seed/win4/400/200" },
  { id: 5, name: "Lisa Thompson", prize: "Truck + $4,100,000", image: "https://picsum.photos/seed/win5/400/200" },
];

function genSerial() {
  return "LT-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function inp(err) {
  return `w-full bg-white border rounded-lg px-4 py-3 text-[15px] text-gray-800 placeholder-gray-400 outline-none transition-colors duration-100 focus:border-orange-500 ${err ? "border-red-400" : "border-gray-300 hover:border-gray-400"}`;
}
function sel(err) {
  return `w-full bg-white border rounded-lg px-4 py-3 text-[15px] text-gray-800 outline-none transition-colors duration-100 focus:border-orange-500 appearance-none cursor-pointer ${err ? "border-red-400" : "border-gray-300 hover:border-gray-400"}`;
}

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] tracking-[0.12em] text-gray-500 uppercase font-semibold select-none">
        {label}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
    </div>
  );
}

function Card({ title, children, accent }) {
  return (
    <div className={`bg-white rounded-xl p-6 flex flex-col gap-5 border ${accent ? "border-orange-200" : "border-gray-200"}`}>
      <p className="text-[10px] tracking-[0.2em] text-orange-600 uppercase font-bold">{title}</p>
      {children}
    </div>
  );
}

function TicketPreview({ form, numbers, draw, photo, total, refCode }) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-orange-600 px-4 py-3 flex justify-between items-center">
        <span className="text-[11px] font-black tracking-[0.16em] text-white">PCH Lottery</span>
        <span className="text-[10px] text-white/70 font-medium">{draw?.date}</span>
      </div>
      <div className="bg-white px-4 pt-4 pb-3 flex gap-3 items-start border-b border-gray-200">
        <div className="w-12 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100 flex items-center justify-center">
          {photo
            ? <img src={photo} alt="ID" className="w-full h-full object-cover" />
            : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            )
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-widest text-gray-500 uppercase mb-0.5">Registrant</div>
          <div className="text-[13px] font-semibold text-gray-800 truncate">
            {(form.firstName || form.lastName)
              ? `${form.firstName} ${form.lastName}`.trim()
              : <span className="text-gray-300">—</span>}
          </div>
          <div className="text-[11px] text-gray-500 truncate mt-0.5">
            {form.city || <span className="text-gray-300">—</span>}
          </div>
        </div>
      </div>
      <div className="bg-white p-4 space-y-3">
        <div>
          <div className="text-[10px] tracking-widest text-gray-500 uppercase mb-1">Draw</div>
          <div className="text-[12px] font-medium text-gray-800">
            {draw?.name} · <span className="text-orange-600">{draw?.prize}</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-widest text-gray-500 uppercase mb-2">Lucky numbers</div>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: PICK_COUNT }, (_, i) => (
              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-[1.5px] transition-all ${numbers[i] ? "border-orange-500 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-300"}`}>
                {numbers[i] ?? "?"}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[10px] tracking-widest text-gray-500 uppercase mb-0.5">Tickets</div>
            <div className="text-[13px] font-semibold text-gray-800">×{form.tickets}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-widest text-gray-500 uppercase mb-0.5">Total</div>
            <div className="text-[15px] font-bold text-orange-600">$0.00</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 text-center text-[9px] tracking-[0.2em] text-gray-400 py-2 border-t border-dashed border-gray-200 font-mono">
        {refCode}
      </div>
    </div>
  );
}

function SuccessModal({ onClose, numbers }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You're in the draw!</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Your lucky numbers are locked in. Good luck!
          </p>
          <div className="flex gap-2 justify-center flex-wrap mb-4">
            {numbers.map(n => (
              <div key={n} className="w-10 h-10 rounded-full bg-orange-50 border-2 border-orange-500 text-orange-600 font-bold text-sm flex items-center justify-center">
                {n}
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-2 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function WinnersCarousel() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 relative">
      {/* removed the trophy emoji here */}
      <h2 className="text-xl font-bold text-gray-800 mb-3">Past Winners</h2>
      <div className="relative">
        <div
          className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {WINNERS.map((w) => (
            <div
              key={w.id}
              className="flex-shrink-0 w-[85%] sm:min-w-[280px] sm:max-w-[280px] snap-start bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
            >
              <img src={w.image} alt={w.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="font-semibold text-gray-800 text-sm">{w.name}</div>
                <div className="text-orange-600 font-bold text-sm">{w.prize}</div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-12 flex items-center justify-center text-gray-400 sm:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none sm:hidden" />
      </div>
    </div>
  );
}

export default function LotteryForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dob: "",
    line1: "", line2: "", city: "", state: "", zip: "",
    draw: "weekly", tickets: 1,
  });
  const [numbers,   setNumbers]   = useState([]);
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [photo,     setPhoto]     = useState(null);
  const [photoErr,  setPhotoErr]  = useState("");
  const [refCode]                 = useState(genSerial);
  const [notification, setNotification] = useState("");
  const fileRef                   = useRef();
  const timerRef                  = useRef(null);

  const set    = useCallback((k, v) => setForm(f => ({ ...f, [k]: v })), []);
  const clrErr = useCallback((k)    => setErrors(e => { const n = { ...e }; delete n[k]; return n; }), []);

  const toggle = useCallback((n) => {
    setNumbers(p => {
      if (p.includes(n)) return p.filter(x => x !== n);
      if (p.length >= PICK_COUNT) return p;
      return [...p, n].sort((a, b) => a - b);
    });
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setPhotoErr("File must be under 5 MB"); return; }
    if (!file.type.startsWith("image/")) { setPhotoErr("Only image files accepted"); return; }
    setPhotoErr("");
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const draw  = DRAWS.find(d => d.id === form.draw);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())    e.firstName = "Required";
    if (!form.lastName.trim())     e.lastName  = "Required";
    if (!form.email.includes("@")) e.email     = "Valid email required";
    if (!form.phone.trim())        e.phone     = "Required";
    if (!form.dob)                 e.dob       = "Required";
    if (!form.line1.trim())        e.line1     = "Required";
    if (!form.city.trim())         e.city      = "Required";
    if (!form.state)               e.state     = "Required";
    if (!form.zip.trim())          e.zip       = "Required";
    if (numbers.length < PICK_COUNT) e.numbers = `Pick all ${PICK_COUNT} numbers`;
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      // Updated notification message
      setNotification("Please complete all required fields before entering.");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setNotification(""), 5000);
    } else {
      setSubmitted(true);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ firstName:"", lastName:"", email:"", phone:"", dob:"", line1:"", line2:"", city:"", state:"", zip:"", draw:"weekly", tickets:1 });
    setNumbers([]);
    setErrors({});
    setPhoto(null);
    setNotification("");
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  if (submitted) {
    return <SuccessModal onClose={reset} numbers={numbers} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center justify-between animate-slideDown">
          <span className="text-sm font-medium">{notification}</span>
          <button onClick={() => setNotification("")} className="text-white/80 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-6 border-b border-gray-200">
        <div className="flex justify-center mb-4">
          <img
            src="/pch-logo.png"
            alt="PCH Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-0.5 bg-orange-600 rounded-full" />
          <p className="text-[10px] tracking-[0.2em] text-orange-600 uppercase font-bold">
            PCH Lottery — Entry Registration
          </p>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.04] tracking-tight mb-3">
          Enter the draw.<br />
          <span className="text-orange-600">Change everything.</span>
        </h1>
        <p className="text-[14px] text-gray-500 leading-relaxed max-w-lg">
          Complete your entry below. All personal data is encrypted and GDPR-compliant. You must be 18+ to participate.
        </p>
      </div>

      <WinnersCarousel />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div className="flex flex-col gap-5">
          <Card title="Profile photo">
            <div className="flex items-center gap-5">
              <div onClick={() => fileRef.current.click()}
                className="w-20 h-20 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-colors flex-shrink-0 relative group">
                {photo
                  ? <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                  : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="group-hover:stroke-orange-500 transition-colors">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                }
                {photo && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] text-white font-semibold">Change</span>
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => fileRef.current.click()}
                  className="text-[13px] font-semibold text-orange-600 hover:text-orange-700 transition-colors block mb-1.5">
                  {photo ? "Change photo" : "Upload photo"}
                </button>
                <p className="text-[12px] text-gray-500 leading-relaxed">JPG or PNG, max 5 MB.<br />Used for identity verification.</p>
                {photoErr && <span className="text-[11px] text-red-500 mt-1 block">{photoErr}</span>}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </Card>

          <Card title="Personal details">
            <div className="grid grid-cols-2 gap-4">
              <Field id="fn" label="First name" error={errors.firstName}>
                <input id="fn" className={inp(errors.firstName)} value={form.firstName}
                  onChange={e => { set("firstName", e.target.value); clrErr("firstName"); }}
                  placeholder="Jane" autoComplete="given-name" />
              </Field>
              <Field id="ln" label="Last name" error={errors.lastName}>
                <input id="ln" className={inp(errors.lastName)} value={form.lastName}
                  onChange={e => { set("lastName", e.target.value); clrErr("lastName"); }}
                  placeholder="Smith" autoComplete="family-name" />
              </Field>
            </div>
            <Field id="em" label="Email address" error={errors.email}>
              <input id="em" type="email" className={inp(errors.email)} value={form.email}
                onChange={e => { set("email", e.target.value); clrErr("email"); }}
                placeholder="jane@example.com" autoComplete="email" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="ph" label="Phone number" error={errors.phone}>
                <input id="ph" className={inp(errors.phone)} value={form.phone}
                  onChange={e => { set("phone", e.target.value); clrErr("phone"); }}
                  placeholder="+1 555 000 0000" autoComplete="tel" />
              </Field>
              <Field id="dob" label="Date of birth" error={errors.dob}>
                <input id="dob" type="date" className={inp(errors.dob)} value={form.dob}
                  onChange={e => { set("dob", e.target.value); clrErr("dob"); }} autoComplete="bday" />
              </Field>
            </div>
          </Card>

          <Card title="Home address">
            <Field id="l1" label="Address line 1" error={errors.line1}>
              <input id="l1" className={inp(errors.line1)} value={form.line1}
                onChange={e => { set("line1", e.target.value); clrErr("line1"); }}
                placeholder="123 Main St" autoComplete="address-line1" />
            </Field>
            <Field id="l2" label="Address line 2 (optional)">
              <input id="l2" className={inp()} value={form.line2}
                onChange={e => set("line2", e.target.value)}
                placeholder="Apt 4B" autoComplete="address-line2" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="city" label="City" error={errors.city}>
                <input id="city" className={inp(errors.city)} value={form.city}
                  onChange={e => { set("city", e.target.value); clrErr("city"); }}
                  placeholder="Los Angeles" autoComplete="address-level2" />
              </Field>
              <Field id="state" label="State" error={errors.state}>
                <select id="state" className={sel(errors.state)} value={form.state} onChange={e => { set("state", e.target.value); clrErr("state"); }}>
                  <option value="">Select</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field id="zip" label="ZIP Code" error={errors.zip}>
              <input id="zip" className={inp(errors.zip)} value={form.zip}
                onChange={e => { set("zip", e.target.value); clrErr("zip"); }}
                placeholder="90210" autoComplete="postal-code" />
            </Field>
          </Card>

          <Card title={`Select ${PICK_COUNT} lucky numbers`}>
            <p className="text-[12px] text-gray-500 -mt-2">Select from 1 to {TOTAL_NUMS}</p>
            <div className="grid grid-cols-9 gap-1.5">
              {Array.from({ length: TOTAL_NUMS }, (_, i) => i + 1).map(n => {
                const picked = numbers.includes(n);
                const full   = !picked && numbers.length >= PICK_COUNT;
                return (
                  <button key={n} onClick={() => !full && toggle(n)} disabled={full}
                    className={`aspect-square rounded-lg text-[11px] font-bold border transition-all duration-100 select-none
                      ${picked
                        ? "bg-orange-600 border-orange-600 text-white shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                        : full
                          ? "border-gray-200 text-gray-200 cursor-not-allowed"
                          : "border-gray-300 text-gray-500 hover:border-orange-500 hover:text-orange-600 active:scale-95"}`}>
                    {n}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">{numbers.length} / {PICK_COUNT} selected</span>
              {numbers.length === PICK_COUNT
                ? <span className="text-[11px] text-orange-600 font-semibold">✓ Complete</span>
                : numbers.length > 0 && (
                  <button onClick={() => setNumbers([])} className="text-[11px] text-gray-500 hover:text-orange-600 transition-colors">Clear all</button>
                )
              }
            </div>
            {errors.numbers && <span className="text-[11px] text-red-500 font-medium -mt-2 block">{errors.numbers}</span>}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Your ticket" accent>
            <TicketPreview form={form} numbers={numbers} draw={draw} photo={photo} total={0} refCode={refCode} />
          </Card>

          <Card title="Choose draw">
            <div className="flex flex-col gap-2">
              {DRAWS.map(d => (
                <div key={d.id} onClick={() => set("draw", d.id)}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-all duration-100 select-none
                    ${form.draw === d.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${form.draw === d.id ? "border-orange-600" : "border-gray-300"}`}>
                    {form.draw === d.id && <div className="w-2 h-2 rounded-full bg-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-gray-800 truncate">{d.name}</div>
                    <div className="text-[11px] text-gray-500">{d.date}</div>
                  </div>
                  <div className={`text-[12px] font-bold flex-shrink-0 transition-colors ${form.draw === d.id ? "text-orange-600" : "text-gray-500"}`}>{d.prize}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Win a Brand New Truck!">
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center mb-4">
                <Truck className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">You could drive away</h3>
              <p className="text-[15px] font-semibold text-orange-600">{draw?.prize}</p>
              <p className="text-sm text-gray-500 mt-2">Plus a luxury truck package</p>
              <button
                onClick={submit}
                className="mt-4 w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white rounded-lg font-bold text-[15px] tracking-wide transition-all duration-150 shadow-[0_4px_24px_rgba(234,88,12,0.3)] hover:shadow-[0_4px_32px_rgba(234,88,12,0.4)]"
              >
                Enter to Win 🚛
              </button>
              <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
                No purchase necessary. Must be 18+. See full terms.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}