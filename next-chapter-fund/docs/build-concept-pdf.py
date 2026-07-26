import base64, pathlib

APP = pathlib.Path("/home/user/57cap.github.io/next-chapter-fund")
SCRATCH = pathlib.Path("/tmp/claude-0/-home-user-57cap-github-io/3a9ec1dd-ceb7-5f0c-a943-d42e25f3440e/scratchpad")

def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode(pathlib.Path(path).read_bytes()).decode()

fraunces = b64(APP / "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2", "font/woff2")
inter    = b64(APP / "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", "font/woff2")

img = {
    "cover":   b64(APP / "public/images/hero-poster.jpg", "image/jpeg"),
    "logo":    b64(APP / "public/images/ghetto-kids-logo-light.png", "image/png"),
    "logoDark":b64(APP / "public/images/ghetto-kids-logo-dark.png", "image/png"),
    "hero":    b64(SCRATCH / "doc/home-hero.jpg", "image/jpeg"),
    "support": b64(SCRATCH / "doc/home-support.jpg", "image/jpeg"),
    "donate":  b64(SCRATCH / "doc/donate.jpg", "image/jpeg"),
    "story":   b64(SCRATCH / "doc/story.jpg", "image/jpeg"),
    "mobile":  b64(SCRATCH / "doc/mobile-home.jpg", "image/jpeg"),
}

HTML = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>The Next Chapter Fund — Concept</title>
<style>
@font-face {{ font-family:'Fraunces'; src:url({fraunces}) format('woff2'); font-weight:100 900; font-display:block; }}
@font-face {{ font-family:'InterV'; src:url({inter}) format('woff2'); font-weight:100 900; font-display:block; }}

@page {{ size: A4; margin: 0; }}
* {{ box-sizing:border-box; margin:0; padding:0; }}
html,body {{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
body {{ font-family:'InterV',sans-serif; color:#1c1917; background:#faf7f1; }}

.page {{
  width:210mm; height:297mm; position:relative; overflow:hidden;
  page-break-after:always; background:#faf7f1;
}}
.page:last-child {{ page-break-after:auto; }}
/* block flow, not flex: flex children shrink when a fixed-height page
   overflows, which silently collapses images to hairlines */
.pad {{ padding:20mm 18mm 26mm; height:100%; position:relative; }}

.serif {{ font-family:'Fraunces',Georgia,serif; font-weight:600; letter-spacing:-0.015em; }}
.eyebrow {{ font-size:7.5pt; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#a83b0e; }}
h1 {{ font-family:'Fraunces',Georgia,serif; font-weight:600; font-size:31pt; line-height:1.08; letter-spacing:-0.02em; }}
h2 {{ font-family:'Fraunces',Georgia,serif; font-weight:600; font-size:19pt; line-height:1.15; letter-spacing:-0.015em; }}
h3 {{ font-family:'Fraunces',Georgia,serif; font-weight:600; font-size:11.5pt; }}
p  {{ font-size:9.7pt; line-height:1.62; color:#44403c; }}
.lead {{ font-size:11pt; line-height:1.6; color:#3b3733; }}
.small {{ font-size:8pt; line-height:1.5; color:#6b6259; }}

/* ---------- cover ---------- */
.cover {{ background:#1c1917; color:#faf7f1; }}
.cover .art {{ position:absolute; inset:0; }}
.cover .art img {{ width:100%; height:100%; object-fit:cover; }}
.cover .scrim {{ position:absolute; inset:0;
  background:linear-gradient(180deg, rgba(28,25,23,.62) 0%, rgba(28,25,23,.74) 42%, rgba(28,25,23,.96) 100%); }}
.cover .inner {{ position:relative; height:100%; padding:22mm 18mm; display:flex; flex-direction:column; }}
.cover h1 {{ color:#faf7f1; font-size:34pt; }}
.cover .kicker {{ font-size:8pt; letter-spacing:0.24em; text-transform:uppercase; color:rgba(250,247,241,.62); font-weight:600; }}
.lockup img {{ width:38mm; display:block; margin-top:3mm; }}
.rule {{ height:2px; width:22mm; background:#e55e22; }}

/* ---------- shared blocks ---------- */
.grid2 {{ display:grid; grid-template-columns:1fr 1fr; gap:6mm; }}
.grid3 {{ display:grid; grid-template-columns:repeat(3,1fr); gap:5mm; }}
.card {{ background:#fff; border:1px solid #e8e0d2; border-radius:3mm; padding:5mm; }}
.card h3 {{ margin-bottom:1.6mm; }}
.card p {{ font-size:8.6pt; line-height:1.5; }}

.phase {{ display:grid; grid-template-columns:8mm 1fr; gap:4mm; padding:4.5mm 0; border-top:1px solid #e3dbcc; }}
.phase:last-child {{ border-bottom:1px solid #e3dbcc; }}
.phase .n {{ font-family:'Fraunces',Georgia,serif; font-size:15pt; color:#cf4a12; line-height:1; }}

.shot {{ border:1px solid #ddd4c4; border-radius:2.5mm; overflow:hidden; background:#fff; }}
.shot img {{ width:100%; display:block; }}
.cap {{ font-size:7.2pt; color:#6b6259; margin-top:2mm; letter-spacing:.02em; }}

.note {{ background:#fdf0e9; border:1px solid #f6c9ae; border-radius:3mm; padding:5mm; }}
.note p {{ color:#6d2a11; font-size:8.8pt; }}

.status li {{ list-style:none; font-size:9pt; line-height:1.5; color:#44403c;
  padding-left:7mm; position:relative; margin-bottom:2.6mm; }}
.status li:before {{ content:''; position:absolute; left:0; top:1.6mm; width:3mm; height:3mm;
  border:1.5px solid #cf4a12; border-radius:50%; }}

.foot {{ position:absolute; left:18mm; right:18mm; bottom:13mm; padding-top:4mm;
  border-top:1px solid #e3dbcc;
  display:flex; justify-content:space-between; align-items:flex-end; gap:8mm; }}
.foot .small {{ font-size:7pt; }}
</style></head><body>

<!-- ============ 1 · COVER ============ -->
<section class="page cover">
  <div class="art"><img src="{img['cover']}" alt=""></div>
  <div class="scrim"></div>
  <div class="inner">
    <div class="lockup">
      <div class="kicker">In support of</div>
      <img src="{img['logo']}" alt="Ghetto Kids">
    </div>
    <div style="margin-top:auto">
      <div class="rule" style="margin-bottom:7mm"></div>
      <h1>The Next<br>Chapter Fund</h1>
      <p style="color:rgba(250,247,241,.82); font-size:11.5pt; line-height:1.55; margin-top:6mm; max-width:118mm">
        A proposal to support the education, artistic development, and long-term
        opportunities of the Ghetto Kids of Uganda.
      </p>
      <div style="margin-top:12mm; display:flex; gap:14mm">
        <div>
          <div class="kicker" style="font-size:7pt">Prepared by</div>
          <p style="color:rgba(250,247,241,.9); font-size:9.5pt; margin-top:1.5mm">A Reyes family initiative</p>
        </div>
        <div>
          <div class="kicker" style="font-size:7pt">Status</div>
          <p style="color:rgba(250,247,241,.9); font-size:9.5pt; margin-top:1.5mm">Private concept — not published</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ 2 · THE IDEA ============ -->
<section class="page"><div class="pad">
  <div class="eyebrow">The idea</div>
  <h2 style="margin-top:5mm; max-width:150mm">Recognition opened a door.<br>Opportunity is what walks them through it.</h2>
  <p class="lead" style="margin-top:6mm; max-width:155mm">
    The Ghetto Kids were already followed by millions before the world's biggest stage
    introduced them to billions more. What changed that night was scale — not their
    talent, and not what they need next.
  </p>
  <p style="margin-top:4mm; max-width:155mm">
    The Next Chapter Fund exists to convert that visibility into something durable:
    school fees paid on time, professional training, mentorship, stable housing and
    healthcare, and a path toward careers these young artists choose for themselves.
    It is an independent initiative, built to support the children — not to promote
    anyone else's involvement in them.
  </p>

  <div class="eyebrow" style="margin-top:11mm">What it funds</div>
  <div class="grid3" style="margin-top:5mm">
    <div class="card"><h3>Education</h3><p>Tuition, books, technology, tutoring, and scholarships.</p></div>
    <div class="card"><h3>Artistic Development</h3><p>Training in dance, music, singing, choreography, and performance.</p></div>
    <div class="card"><h3>Mentorship</h3><p>Access to artists, producers, choreographers, and educators.</p></div>
    <div class="card"><h3>Well-Being</h3><p>Housing, nutrition, healthcare, safety, and responsible adult support.</p></div>
    <div class="card"><h3>Global Opportunities</h3><p>Educational exchanges, workshops, residencies, and cultural experiences.</p></div>
    <div class="card"><h3>Creative Projects</h3><p>Music, film, live performance, and content that builds sustainable careers.</p></div>
  </div>

  <div class="eyebrow" style="margin-top:11mm">How it is staged</div>
  <div style="margin-top:4mm">
    <div class="phase"><div class="n">1</div><div>
      <h3>Support today</h3>
      <p>Reliable funding for education, housing, nutrition, healthcare, and immediate needs.</p></div></div>
    <div class="phase"><div class="n">2</div><div>
      <h3>Develop their talent</h3>
      <p>Professional programs in dance, music, performance, content creation, and mentorship.</p></div></div>
    <div class="phase"><div class="n">3</div><div>
      <h3>Build long-term opportunity</h3>
      <p>Scholarships, international educational programs, industry partnerships, and career pathways —
         developed with qualified legal, educational, and child-welfare professionals.</p></div></div>
  </div>

  <div class="foot"><p class="small">The Next Chapter Fund · Concept document</p><p class="small">2</p></div>
</div></section>

<!-- ============ 3 · THE SITE ============ -->
<section class="page"><div class="pad">
  <div class="eyebrow">The website</div>
  <h2 style="margin-top:5mm; max-width:150mm">Built to be credible before it is public.</h2>
  <p style="margin-top:5mm; max-width:155mm">
    A complete site is built and ready — six pages covering their story, the mission,
    the plan, transparency reporting, and donations. It is written to portray the
    children as talented young artists with ambition and agency, never as objects of pity.
    Nothing has been published.
  </p>

  <div style="margin-top:7mm; display:grid; grid-template-columns:118mm 50mm; gap:6mm; align-items:start">
    <div>
      <div class="shot"><img src="{img['hero']}" alt="Homepage on desktop"></div>
      <p class="cap">Homepage — the opening frame, over footage from backstage.</p>
    </div>
    <div>
      <div class="shot"><img src="{img['mobile']}" alt="Homepage on mobile"></div>
      <p class="cap">Built mobile-first.</p>
    </div>
  </div>

  <div class="grid2" style="margin-top:6mm">
    <div>
      <div class="shot"><img src="{img['support']}" alt="Areas of support"></div>
      <p class="cap">Six areas of support.</p>
    </div>
    <div>
      <div class="shot"><img src="{img['donate']}" alt="Donation page"></div>
      <p class="cap">Donations — one-time or monthly.</p>
    </div>
  </div>

  <div class="foot"><p class="small">The Next Chapter Fund · Concept document</p><p class="small">3</p></div>
</div></section>

<!-- ============ 4 · CARE, STATUS, ASK ============ -->
<section class="page"><div class="pad">
  <div class="eyebrow">How this is being handled</div>
  <h2 style="margin-top:5mm; max-width:150mm">Nothing goes live until the people closest to these children say yes.</h2>

  <ul class="status" style="margin-top:7mm; max-width:158mm">
    <li><strong>Not published.</strong> The site is private and will stay that way until every approval below is in hand.</li>
    <li><strong>Guardian consent first.</strong> Written approval from each child's legal guardian for the use of their names, images, and stories is a precondition, not a formality.</li>
    <li><strong>No endorsement implied.</strong> The site states plainly that references to any artist, performance, company, or event do not imply sponsorship or endorsement. Every reference is factual.</li>
    <li><strong>No fabricated results.</strong> Impact figures are left empty until real, verified numbers exist. No invented totals, no borrowed credibility.</li>
    <li><strong>Child welfare before content.</strong> Guiding principles include education before exposure and child welfare before content.</li>
    <li><strong>Structured properly.</strong> Funds will be held and accounted for through an established nonprofit structure, with disbursements to the children's needs in Uganda made through their existing organization.</li>
  </ul>

  <div class="note" style="margin-top:9mm">
    <p><strong>On the reference to Shakira.</strong> The homepage currently opens with the line
    “Shakira helped the world see them.” It is written as a statement of fact about the
    performance — deliberately not a claim of endorsement, partnership, or involvement.
    If any wording, image, or footage is unwelcome, it will be changed or removed
    immediately, no explanation needed.</p>
  </div>

  <div class="eyebrow" style="margin-top:11mm">What we are asking</div>
  <p style="margin-top:4mm; max-width:158mm">
    Nothing binding, and no association is assumed. We wanted you to see this before
    anyone else does. Specifically: that you are comfortable with the reference above
    and the use of the backstage footage — and, only if it is ever of interest, that the
    door stays open to whatever involvement you might welcome. A “no” to any part of it
    is completely fine and changes nothing about the work.
  </p>

  <div class="foot">
    <div>
      <div class="eyebrow" style="font-size:7pt">Contact</div>
      <p class="small" style="margin-top:1.5mm; font-size:8.5pt">[Name] · [email] · [phone]</p>
    </div>
    <p class="small">4</p>
  </div>
</div></section>

</body></html>
"""

out = SCRATCH / "concept.html"
out.write_text(HTML)
print("html", round(out.stat().st_size / 1e6, 2), "MB")
