
# Divirgent Test V2.1 (LT) — OCEAN + Tipai + rekomendacijos

**Trumpai:** 60 teiginių asmenybės testas pagal Big Five (OCEAN) su **tipų priskyrimu** ir **praktinėmis rekomendacijomis**. Skaičiavimas vyksta **lokaliai** naršyklėje, todėl atsakymai **niekur nesiunčiami**.

> ⏱️ 8–10 min · 🧭 Domenai: E, A, C, N, O · 🧠 Tipai: Dirigentė, Analitikas, Diplomatė, Inovatorė, Stabilizuotoja, Mentorius, Variklis, Architektė

---

## Kaip naudoti

1. Atidaryk https://github.com/olemoz1977/Diergent-test-2/public
2. Pažymėk atsakymus (1–5). Invertuoti teiginiai pažymėti *kursyvu* ir perskaičiuojami automatiškai.
3. Spausk **Gauti rezultatą** → gausi radar grafiką, TOP‑3 tipus ir **praktines rekomendacijas**.
4. Paspausk **Atsisiųsti PDF**, jei reikia.

> Jei nori 30‑ies rinkinį, JSON faile yra `items_core`; UI jungiklį galima įjungti per mažą pakeitimą.

---

## Kas „po kapotu“

- **Klausimai/skalė**: žr. [`divirgent_v2_items_lt.json`](divirgent_v2_items_lt.json). Domenai: Ekstraversija, Malonumas, Sąžiningumas/Atidumas, Neurotiškumas, Atvirumas patirčiai.
- **Invertuotų teiginių logika**: `6 − atsakymas`.
- **Domenų balai**: vidurkiai (1–5). 
- **Normalizacija**: vidurkiai paverčiami į **z‑scores**; **Emocinis stabilumas (ES) = −Z(Neurotiškumas)**.
- **Tipų priskyrimas**: kosinis panašumas tarp tavo [E,A,C,ES,O] ir tipų **centroidų** (`type_centroids`). Rodomas TOP‑3.
- **Rekomendacijos**: kuriamos pagal **TOP‑2 domenus** + **TOP tipą** — duodamos **SMART‑stiliaus mikro‑praktikos**.

> Pastaba: Tai **savęs įsivertinimas**, ne diagnostika. Be normatyvinių duomenų interpretacijos yra indikatyvios.

---

## Publikavimas per GitHub Pages

- Repo → **Settings → Pages** → „Deploy from a branch“ (pvz., `main`). Failai `index.html` ir `divirgent_v2_items_lt.json` turi būti šakniniame kataloge.
- Po kelių minučių puslapis bus aktyvus.

---

## Psichometrinės atramos (santrauka)

- **Trumpų formų patikimumas domenams**: BFI‑2‑S (30) rodo, kad domenų lygmenyje išlaikomas didelis patikimumas/validumas; facetams reikia ilgesnių formų. 
- **IPIP** (viešasis domenas) teikia ilgesnes alternatyvas (60/120/300) ir aiškius raktus.

> Rekomenduojama: jei planuojama platesnė diegimo aplinka, atlikti **pilotą** (N ≥ 100) ir patikrinti vidinį nuoseklumą (α/ω), bei struktūrą (paralelinė analizė/EFA).

---

## Privatumas

- Nerenkamos jokios asmens duomenų ataskaitos; skaičiavimas vyksta naršyklėje.
- Jei įjungsi analitiką, rinkis „privacy‑first“ sprendimus (pvz., tik agreguoti įvykius, be slapukų).

---

## Licencija ir pritaikymas

- Projektas skirtas **mokymuisi ir demonstracijai**. Klausimų formuluotės kurtos remiantis Big Five koncepcija ir viešo domeno IPIP/BFI‑2 praktikomis.
- Gali adaptuoti tekstus ir tipų centroidus pagal savo organizacijos kalbą/kontekstą.

---

## Roadmap

- [ ] 30↔60 jungiklis UI’e
- [ ] Facetų vizualizacijos (po 3 per domeną)
- [ ] URL „state“ kodavimas (atsakymų dalinimasis be serverio)
- [ ] i18n (EN/LT) per JSON

---

## Įsitraukimas

PR’ai ir pasiūlymai laukiami. Jei randi klaidą – atidaryk „issue“.

